import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timeOfDay, weather } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User error:', userError);
      throw new Error('User not authenticated');
    }

    // Get user's viewing history
    const { data: viewHistory, error: historyError } = await supabase
      .from('dish_views')
      .select('dish_title, dish_category')
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(10);

    if (historyError) {
      console.error('History error:', historyError);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context from viewing history
    const historyContext = viewHistory && viewHistory.length > 0
      ? `Lịch sử xem gần đây: ${viewHistory.map(v => `${v.dish_title} (${v.dish_category})`).join(', ')}`
      : 'Chưa có lịch sử xem món ăn';

    // Create AI prompt
    const systemPrompt = `Bạn là chuyên gia về ẩm thực Việt Nam. Nhiệm vụ của bạn là gợi ý 3 món ăn phù hợp với điều kiện hiện tại.

Hãy xem xét:
1. Thời gian trong ngày: ${timeOfDay}
2. Thời tiết: ${weather}
3. ${historyContext}

Đề xuất 3 món ăn Việt Nam phù hợp, mỗi món bao gồm:
- Tên món
- Lý do phù hợp với thời tiết và thời gian
- Đặc điểm nổi bật
- Phân loại (Món Chính, Món Khai Vị, Bữa Sáng, v.v.)

Trả lời bằng JSON với cấu trúc:
{
  "recommendations": [
    {
      "title": "Tên món",
      "reason": "Lý do gợi ý",
      "features": "Đặc điểm",
      "category": "Phân loại"
    }
  ]
}`;

    console.log('Calling AI with prompt:', systemPrompt);

    // Call AI API
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Hãy gợi ý món ăn cho tôi.' }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Đã vượt quá giới hạn, vui lòng thử lại sau.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Cần nạp thêm credit, vui lòng liên hệ quản trị viên.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', data);
    
    const content = data.choices[0].message.content;
    const recommendations = JSON.parse(content);

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
