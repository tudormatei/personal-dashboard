import { useEffect, useMemo, useState } from "react";
import {
  FormCard,
  FormGrid,
  InputGroup,
  List,
  EmptyState,
  Stat,
  StatContainer,
} from "./Mastery.styled";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { H1 } from "../../components/Typography/Headings";
import type { operations } from "../../types/api-routes";
import MasteryActivityItem from "./MasteryActivityItem";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import type { AlertData } from "../../types/types";

type MasteryListResponse =
  operations["list_mastery_activities_api_mastery__get"]["responses"][200]["content"]["application/json"];

type MasteryActivityResponse =
  operations["get_mastery_activity_api_mastery__activity_id__get"]["responses"][200]["content"]["application/json"];

type CreateMasteryRequest =
  operations["create_mastery_activity_api_mastery__post"]["requestBody"]["content"]["application/json"];

type LogHoursRequest =
  operations["log_activity_hours_api_mastery__activity_id__log_post"]["requestBody"]["content"]["application/json"];

const prettyHours = (hours: number) =>
  new Intl.NumberFormat().format(Math.round(hours * 10) / 10);

const Mastery = () => {
  const [activities, setActivities] = useState<MasteryActivityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [newName, setNewName] = useState("");
  const [startingHours, setStartingHours] = useState<number>(0);
  const [newMax, setNewMax] = useState<number>(10000);
  const [quickAdds, setQuickAdds] = useState<Record<number, string>>({});

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleActivity = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const fetchActivities = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const listResponse = await fetch("/api/mastery/");
      if (!listResponse.ok) {
        throw new Error("Failed to fetch mastery activities");
      }

      const listJson = (await listResponse.json()) as MasteryListResponse;

      const detailResults = await Promise.all(
        listJson.map(async (item) => {
          const response = await fetch(`/api/mastery/${item.id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch activity ${item.id}`);
          }

          return (await response.json()) as MasteryActivityResponse;
        }),
      );

      setActivities(detailResults);
    } catch {
      setAlert({
        text: "Something went wrong while loading mastery data",
        type: "error",
      });
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const addActivity = async () => {
    if (!newName.trim()) return;

    const payload: CreateMasteryRequest = {
      name: newName.trim(),
      starting_hours: startingHours,
      max_hours: newMax,
    };

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/mastery/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      const created = (await response.json()) as MasteryActivityResponse;

      setActivities((prev) => [created, ...prev]);
      setNewName("");
      setStartingHours(0);
      setNewMax(10000);
    } catch {
      setAlert({
        text: "Something went wrong while creating the activity",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHours = async (activityId: number, hours: number) => {
    if (!Number.isFinite(hours) || hours <= 0) return;

    const payload: LogHoursRequest = { hours };

    try {
      const response = await fetch(`/api/mastery/${activityId}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to log hours");
      }

      const updated = (await response.json()) as MasteryActivityResponse;

      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId ? updated : activity,
        ),
      );

      setQuickAdds((prev) => ({
        ...prev,
        [activityId]: "",
      }));
    } catch {
      setAlert({
        text: "Something went wrong while logging hours",
        type: "error",
      });
    }
  };

  const setQuickAdd = (activityId: number, value: string) => {
    setQuickAdds((prev) => ({
      ...prev,
      [activityId]: value,
    }));
  };

  const submitQuickAdd = (activityId: number) => {
    const rawValue = quickAdds[activityId] ?? "";
    const value = Number(rawValue);

    if (!Number.isFinite(value) || value <= 0) return;

    addHours(activityId, value);
  };

  const totalTrackedHours = useMemo(
    () => activities.reduce((sum, item) => sum + item.total_hours, 0),
    [activities],
  );

  const deleteActivity = async (activityId: number) => {
    const confirmed = window.confirm(
      "Delete this activity? This will also remove its logged history.",
    );

    if (!confirmed) return;

    setAlert(null);

    try {
      const response = await fetch(`/api/mastery/${activityId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      setActivities((prev) =>
        prev.filter((activity) => activity.id !== activityId),
      );
      setQuickAdds((prev) => {
        const next = { ...prev };
        delete next[activityId];
        return next;
      });

      setExpandedId((prev) => (prev === activityId ? null : prev));
    } catch {
      setAlert({
        text: "Something went wrong while deleting the activity",
        type: "error",
      });
    }
  };

  return (
    <>
      <H1>Mastery Dashboard</H1>

      <StatContainer>
        <Stat>{activities.length} activities</Stat>
        <Stat>{prettyHours(totalTrackedHours)}h logged</Stat>
      </StatContainer>

      <FormCard>
        <FormGrid>
          <InputGroup>
            <Input
              aria-label="Activity name"
              placeholder="New activity name (e.g. Guitar, Coding, Drawing)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              aria-label="Starting hours"
              type="number"
              min="0"
              placeholder="Starting hours"
              value={startingHours === 0 ? "" : startingHours}
              onChange={(e) => setStartingHours(Number(e.target.value) || 0)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              aria-label="Mastery goal"
              type="number"
              min="1"
              placeholder="Goal hours"
              value={newMax}
              onChange={(e) => setNewMax(Number(e.target.value) || 10000)}
            />
          </InputGroup>

          <Button variant="primary" onClick={addActivity} loading={loading}>
            Add activity
          </Button>
        </FormGrid>
      </FormCard>

      {loading && <Loader text="Loading activities..." />}
      {alert && <Alert {...alert} />}

      <List>
        {!loading && activities.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>No activities yet</h3>
            <p>
              Add something you want to become absurdly good at and start
              stacking hours.
            </p>
          </EmptyState>
        ) : (
          activities.map((activity) => (
            <MasteryActivityItem
              key={activity.id}
              activity={activity}
              isExpanded={expandedId === activity.id}
              onToggle={() => toggleActivity(activity.id)}
              quickAddValue={quickAdds[activity.id] ?? ""}
              onQuickAddChange={setQuickAdd}
              onSubmitQuickAdd={submitQuickAdd}
              onAddHours={addHours}
              onDelete={deleteActivity}
            />
          ))
        )}
      </List>
    </>
  );
};

export default Mastery;
