import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  user_id: string;
  dish_id: string;
  comment: string;
  created_at: string;
}

export const useComments = (dishId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [dishId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("dish_comments")
        .select("*")
        .eq("dish_id", dishId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Vui lòng đăng nhập",
          description: "Bạn cần đăng nhập để bình luận",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("dish_comments")
        .insert({
          user_id: user.id,
          dish_id: dishId,
          comment: comment,
        });

      if (error) throw error;

      await fetchComments();
      
      toast({
        title: "Bình luận thành công!",
        description: "Cảm ơn bạn đã chia sẻ",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi bình luận",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("dish_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      await fetchComments();
      
      toast({
        title: "Đã xóa bình luận",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận",
        variant: "destructive",
      });
    }
  };

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments,
  };
};
