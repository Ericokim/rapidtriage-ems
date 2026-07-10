import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { TriageRecordCard } from "@/src/components/triage/TriageRecordCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { TabScreen } from "@/src/components/layout/TabScreen";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

const FILTERS = ["All Records", "Pending", "In-Transit", "Synced", "Failed"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(record: LocalTriageRecord, filter: Filter): boolean {
  switch (filter) {
    case "All Records":
      return true;
    case "Pending":
      return record.status === "Pending";
    case "In-Transit":
      return record.status === "In-Transit";
    case "Synced":
      return record.syncStatus === "synced";
    case "Failed":
      return record.syncStatus === "failed";
  }
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yst = new Date(today);
  yst.setDate(today.getDate() - 1);
  if (d.toDateString() === yst.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function HistoryScreen() {
  const { records } = useSync();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All Records");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (!matchesFilter(r, filter)) return false;
      if (!q) return true;
      return (
        r.patientName.toLowerCase().includes(q) ||
        r.conditionDescription.toLowerCase().includes(q)
      );
    });
  }, [records, query, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, LocalTriageRecord[]>();
    for (const r of filtered) {
      const label = dayLabel(r.createdAt);
      const arr = map.get(label) ?? [];
      arr.push(r);
      map.set(label, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  const header = (
    <View className="gap-3">
      <View className="gap-1">
        <Text className="text-4xl font-extrabold" style={{ color: colors.navy950 }}>
          History
        </Text>
        <Text className="text-base" style={{ color: colors.slate500 }}>
          View all previously saved triage records.
        </Text>
      </View>

      <View
        className="flex-row items-center gap-2 rounded-2xl px-4"
        style={{
          backgroundColor: searchFocused ? colors.blue50 : colors.white,
          borderWidth: searchFocused ? 2 : 1,
          borderColor: searchFocused ? colors.navy700 : colors.slate200,
          minHeight: 52,
        }}
      >
        <Ionicons name="search" size={20} color={searchFocused ? colors.navy700 : colors.slate400} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search records..."
          placeholderTextColor={colors.slate400}
          className="flex-1 text-base"
          style={{ color: colors.navy950, paddingVertical: 12 }}
        />
      </View>

      <View className="flex-row flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setFilter(f)}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: active ? colors.navy950 : colors.white,
                borderWidth: 1,
                borderColor: active ? colors.navy950 : colors.slate200,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: active ? colors.white : colors.slate600 }}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <TabScreen header={header}>
      {groups.length === 0 ? (
        <EmptyState
          title="No records found"
          message="Try a different search or filter."
        />
      ) : (
        groups.map(([label, items]) => (
          <View key={label} className="gap-3">
            <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
              {label}
            </Text>
            {items.map((record) => (
              <TriageRecordCard
                key={record.id}
                record={record}
                onPress={() => router.push(`/records/${record.id}`)}
              />
            ))}
          </View>
        ))
      )}
    </TabScreen>
  );
}
