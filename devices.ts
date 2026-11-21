// per-device presence — same source PlatformIndicators reads (PresenceStore.getClientStatus),
// so a desktop going idle while mobile stays online is its own change instead of being hidden
// behind the single aggregate status

import { CLIENT_EMOJI, CLIENT_LABEL_MAP, STATUS_LABEL } from "./constants"

// platform -> status, e.g. { desktop: "online", mobile: "idle" }. missing platform = offline
export type DeviceMap = Record<string, string>

export interface DeviceChange {
    platform: string
    from: string  // "offline" when the device wasn't connected before
    to: string    // "offline" when the device disconnected
    ts: number
}

// null means this tick didn't say anything about devices, so leave the cache alone
export function readDevices(cs?: Record<string, string> | null): DeviceMap | null {
    if (!cs || typeof cs !== "object") return null
    const out: DeviceMap = {}
    for (const [p, s] of Object.entries(cs)) if (s && s !== "offline") out[p] = s
    return out
}

export function diffDevices(prev: DeviceMap, next: DeviceMap, ts = Date.now()): DeviceChange[] {
    const changes: DeviceChange[] = []
    for (const platform of new Set([...Object.keys(prev), ...Object.keys(next)])) {
        const from = prev[platform] ?? "offline"
        const to = next[platform] ?? "offline"
        if (from !== to) changes.push({ platform, from, to, ts })
    }
    return changes
}

export const deviceLabel = (p: string) => `${CLIENT_EMOJI[p] || "📡"} ${CLIENT_LABEL_MAP[p] || p}`
const statusLabel = (s: string) => STATUS_LABEL[s] || s

// "came online on 📱 Mobile", "went offline on 💻 Desktop", "is now Away on 💻 Desktop"
export function describeDeviceChange(c: DeviceChange): string {
    const dev = deviceLabel(c.platform)
    if (c.from === "offline") return c.to === "online" ? `came online on ${dev}` : `came online on ${dev} (${statusLabel(c.to)})`
    if (c.to === "offline") return `went offline on ${dev}`
    return `is now ${statusLabel(c.to)} on ${dev}`
}

// "💻 Desktop: Online → Away"
export function shortDeviceChange(c: DeviceChange): string {
    return `${deviceLabel(c.platform)}: ${statusLabel(c.from)} → ${statusLabel(c.to)}`
}

// "💻 Desktop (Online), 📱 Mobile (Away)"
export function describeDevices(map: DeviceMap): string {
    return Object.entries(map).map(([p, s]) => `${deviceLabel(p)} (${statusLabel(s)})`).join(", ")
}
