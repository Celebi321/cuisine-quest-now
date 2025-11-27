import { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useComments } from "@/hooks/useComments";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface CommentSectionProps {
  dishId: string;
}

export const CommentSection = ({ dishId }: CommentSectionProps) => {
  const { comments, loading, addComment, deleteComment } = useComments(dishId);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await addComment(newComment);
    setNewComment("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <MessageCircle className="h-4 w-4" />
        <span>Bình luận ({comments.length})</span>
      </div>

      {/* Comment Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Chia sẻ trải nghiệm của bạn về món này..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <Button 
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="w-full sm:w-auto"
        >
          Gửi bình luận
        </Button>
      </div>

      {/* Comments List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="glass-card p-4 rounded-lg space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {currentUserId === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteComment(comment.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
