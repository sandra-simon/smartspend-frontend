import AppLayout from "../layouts/AppLayout";
import CategoryManagement from "../components/organisms/CategoryManagement";
import Preferences from "../components/organisms/Preferences";

function SettingsPage() {
  return (
    <AppLayout wide>
      <div className="mx-auto max-w-5xl space-y-7">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Settings
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your tracking categories, appearance mode, and localization
            preferences.
          </p>
        </div>

        <CategoryManagement />

        <Preferences />
      </div>
    </AppLayout>
  );
}

export default SettingsPage;
