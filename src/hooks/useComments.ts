import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Validation constants
export const MIN_COMMENT_LENGTH = 3;
export const MAX_COMMENT_LENGTH = 2000;

// Comment validation schema
const commentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(MIN_COMMENT_LENGTH, { message: `Bình luận phải có ít nhất ${MIN_COMMENT_LENGTH} ký tự` })
    .max(MAX_COMMENT_LENGTH, { message: `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự` })
});

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
};

// Interface cho view công khai (không có user_id)
export interface PublicComment {
  id: string;
  dish_id: string;
  comment: string;
  created_at: string;
}

// Interface cho bình luận đầy đủ (dùng nội bộ)
export interface Comment extends PublicComment {
  user_id?: string;
}

export const useComments = (dishId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userCommentIds, setUserCommentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [dishId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Lấy bình luận từ view công khai (không có user_id)
      const { data: publicData, error: publicError } = await supabase
        .rpc('get_public_comments', { dish_id_param: dishId }) as { data: PublicComment[] | null, error: any };

      if (publicError) {
        // Fallback: dùng bảng gốc nếu RPC chưa có
        const { data, error } = await supabase
          .from("dish_comments")
          .select("id, dish_id, comment, created_at")
          .eq("dish_id", dishId)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setComments(data || []);
      } else {
        setComments(publicData || []);
      }

      // Lấy danh sách comment IDs của user hiện tại (nếu đã đăng nhập)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userComments } = await supabase
          .from("dish_comments")
          .select("id")
          .eq("dish_id", dishId)
          .eq("user_id", user.id);
        
        setUserCommentIds(new Set(userComments?.map(c => c.id) || []));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (comment: string) => {
    try {
      // Validate input
      const validationResult = commentSchema.safeParse({ comment });
      
      if (!validationResult.success) {
        toast({
          title: "Lỗi",
          description: validationResult.error.errors[0]?.message || "Bình luận không hợp lệ",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Vui lòng đăng nhập",
          description: "Bạn cần đăng nhập để bình luận",
          variant: "destructive",
        });
        return;
      }

      // Sanitize the comment before saving
      const sanitizedComment = sanitizeInput(validationResult.data.comment);

      const { error } = await supabase
        .from("dish_comments")
        .insert({
          user_id: user.id,
          dish_id: dishId,
          comment: sanitizedComment,
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

  // Kiểm tra user có phải là chủ comment không
  const isOwner = (commentId: string): boolean => {
    return userCommentIds.has(commentId);
  };

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    isOwner,
    refetch: fetchComments,
  };
};
