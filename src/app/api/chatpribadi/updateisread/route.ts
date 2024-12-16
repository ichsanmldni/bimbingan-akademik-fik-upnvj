import prisma from '../../../../lib/prisma';

export async function PATCH(req) {
    try {
      const body = await req.json();
  
      const {id} = body;
      
      if (!id) {
        
        return new Response(
          JSON.stringify({ message: 'Invalid data' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
  
      const existingRecord = await prisma.chatpribadi.findUnique({
        where: { id },
      });
      
      if (!existingRecord) {
        throw new Error('Record not found');
      }
      
      const ChatPribadi = await prisma.chatpribadi.update({ where: { id }, data: { is_pesan_terakhir_read: true } })
  
      return new Response(JSON.stringify(ChatPribadi), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      
      
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Something went wrong', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }