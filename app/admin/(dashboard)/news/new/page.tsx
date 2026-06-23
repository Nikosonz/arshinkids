import { AdminHeader, Card } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";
import { createPost } from "../actions";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div>
      <AdminHeader title="خبر جدید" />
      <Card>
        <PostForm action={createPost} />
      </Card>
    </div>
  );
}
