import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/dialog"
import { Button } from "@repo/ui/components/button"
import { Field, FieldGroup } from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { FaRegEdit } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react"
import { toast } from "sonner"
import { updateNoteMetadata } from "../app/actions/notes"

export function AccessDialog({ noteId, editors }: { noteId: string, editors: string[] }) { 
    const [editorsList, setEditorsList] = useState<string[]>(editors);
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            setEditorsList([...editorsList, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await updateNoteMetadata(noteId, { editors: editorsList });
            
            setEditorsList(response.editors || []);
            toast("Editors updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast("Failed to update editors");
        }
    };

    return (
        <Dialog>
            <DialogTrigger >
                <Button variant="outline" size="sm">
                    <FaRegEdit className="mr-2" />
                    Access
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Manage Access</DialogTitle>
                    <DialogDescription>
                        Add the email addresses of people who can edit this note. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="editors">People with access</Label>
                        <Input id="editors" name="editors"
                            placeholder="Enter editor email, etc."
                            value={inputValue}
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown} />
                    </Field>
                    {editorsList?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {editorsList.map((editor, idx) => (
                                <span
                                    key={idx}
                                    className="flex items-center justify-between min-w-full bg-blue-100 px-3 py-1 rounded-md  text-sm font-medium shadow-sm"
                                >
                                    {editor}
                                    <span className="ml-2 cursor-pointer" onClick={() => setEditorsList(editorsList.filter((_, i) => i !== idx))}>
                                        <RxCross2 />
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </FieldGroup>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
