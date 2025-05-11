import { useRouter } from "next/navigation";
import ButtonContent from "../custom/button-content";
import { Button } from "../ui/button";

type FromButtonsProps = {
    loading: boolean;
    id?: string
}

export default function FormButtons({ loading, id }: FromButtonsProps) {
    const router = useRouter();
    return (
        <div className="flex justify-end my-4 gap-2">
            <Button
                aria-label='Cancel'
                type="button"
                variant={"outline"}
                onClick={() => router.back()}
            >
                Cancel
            </Button>

            <Button
                aria-label='Submit'
                type="submit"
                disabled={loading}
            >
                <ButtonContent
                    status={loading}
                    text={id ? "Update" : "Create"}
                />
            </Button>
        </div>
    );
}