import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";
import { updatePost } from "../actions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } }).catch(() => null);
  if (!post) notFound();

  return (
    <div>
      <AdminHeader title={`ویرایش: ${post.title}`} />
      <Card>
        <PostForm action={updatePost.bind(null, post.id)} values={post} />
      </Card>
    </div>
  );
}
