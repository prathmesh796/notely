export type Operation = {
    type: "insert" | "delete";
    position: number;
    text?: string; // Only for insert operations
};

export type WSMessage =
    | {
        type: "join-room";
        noteId: string;
        token: string;
      }
    | {
        type: "leave-room";
      }
    | {
        type: "operation";
        noteId: string;
        operation: Operation;
      }
    | {
        type: "content";
        noteId: string;
        content: string;
      }
    | {
        type: "cursor";
        noteId: string;
        position: number;
      }
    | {
        type: "sync";
        noteId: string;
      };
