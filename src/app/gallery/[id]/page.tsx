import Image from "next/image";
import TitlePage from "@/components/custom/page-heading";
import BackButton from "./BackButton";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { getByIdImage } from "@/lib/getImage";

export default async function Photos({ params }: { params: { id: string } }) {
  const { id } = params;
  const image = await getByIdImage(id);

  if (!image?.url) {
    return <SomethingWentWrong message="Failed to fetch image" />;
  }

  return (
    <>
      <TitlePage title={`Image ${image.id}`} description={image.title || "No title available"} />
      <Image src={image.url} alt={image.title || "Image"} width={400} height={400} className="rounded-md aspect-square" />
      <div>
        <BackButton />
      </div>
    </>
  );
}