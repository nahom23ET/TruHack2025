import { UserSettings } from "@/components/user-settings"

export default function SettingsPage() {
  return (
    <div className="md:ml-64 pt-16 md:pt-0">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <UserSettings />
    </div>
  )
}

