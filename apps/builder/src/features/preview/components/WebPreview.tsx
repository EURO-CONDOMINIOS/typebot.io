import { ThunderIcon } from "@/components/icons";
import { useEditor } from "@/features/editor/providers/EditorProvider";
import { useTypebot } from "@/features/editor/providers/TypebotProvider";
import { useGraph } from "@/features/graph/providers/GraphProvider";
import { useUser } from "@/features/user/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import type { ContinueChatResponse } from "@typebot.io/bot-engine/schemas/api";
import { Standard } from "@typebot.io/nextjs";

export const WebPreview = () => {
  const { user } = useUser();
  const { typebot } = useTypebot();
  const { startPreviewAtGroup, startPreviewAtEvent } = useEditor();
  const { setPreviewingBlock } = useGraph();

  const { showToast } = useToast();

  const handleNewLogs = (logs: ContinueChatResponse["logs"]) => {
    logs?.forEach((log) => {
      showToast({
        icon: <ThunderIcon />,
        status: log.status as "success" | "error" | "info",
        title: log.status === "error" ? "An error occured" : undefined,
        description: log.description,
        details: log.details
          ? {
              lang: "json",
              content:
                typeof log.details === "string"
                  ? log.details
                  : JSON.stringify(log.details, null, 2),
            }
          : undefined,
      });
      if (log.status === "error") console.error(log);
    });
  };

  if (!typebot) return null;

  return (
    <Standard
      key={`web-preview${startPreviewAtGroup ?? ""}`}
      typebot={typebot}
      sessionId={user ? `${typebot.id}-${user.id}` : undefined}
      startFrom={
        startPreviewAtGroup
          ? { type: "group", groupId: startPreviewAtGroup }
          : startPreviewAtEvent
            ? { type: "event", eventId: startPreviewAtEvent }
            : undefined
      }
      onNewInputBlock={(block) =>
        setPreviewingBlock({
          id: block.id,
          groupId:
            typebot.groups.find((g) => g.blocks.some((b) => b.id === block.id))
              ?.id ?? "",
        })
      }
      onNewLogs={handleNewLogs}
      style={{
        borderWidth: "1px",
        borderRadius: "0.25rem",
      }}
    />
  );
};
