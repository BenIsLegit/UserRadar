import { STATUS_LABEL } from "../constants"
import { deviceLabel } from "../devices"
import { ico } from "./icons"
import { C } from "./theme"

export interface DeviceTimelineEntry {
    platform: string
    from: string | null
    to: string
    time: string
    ts: number
}

const STATUS_DOT: Record<string, string> = { online: "#23a55a", idle: "#f0b232", dnd: "#da373c" }
const dot = (s: string) => STATUS_DOT[s] || "#80848e"
const label = (s: string) => STATUS_LABEL[s] || s

function entryText(e: DeviceTimelineEntry): string {
    const dev = deviceLabel(e.platform)
    if (e.from === null) return `${dev} · already ${label(e.to)}`
    if (e.from === "offline") return e.to === "online" ? `${dev} came online` : `${dev} came online · ${label(e.to)}`
    if (e.to === "offline") return `${dev} went offline`
    return `${dev} · ${label(e.from)} → ${label(e.to)}`
}

// per-device rows inside the status session card; replaces the old single "primary platform" list
export function DeviceTimeline({ entries }: { entries: DeviceTimelineEntry[] }) {
    return (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
            <div style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: C.subheader,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
            }}>
                <span style={{ display: "flex", alignItems: "center" }}><ico.activity /></span>
                Device Timeline
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {entries.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
                        <div style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: dot(e.to),
                            flexShrink: 0,
                            boxShadow: `0 0 0 3px ${dot(e.to)}30`,
                        }} />
                        {i < entries.length - 1 && (
                            <div style={{
                                position: "absolute",
                                left: 4,
                                top: 14,
                                width: 2,
                                height: 24,
                                background: C.border,
                                borderRadius: 1,
                            }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0, paddingBottom: i < entries.length - 1 ? 8 : 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.header }}>
                                    {entryText(e)}
                                </span>
                                <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginLeft: "auto" }}>
                                    {e.time}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
