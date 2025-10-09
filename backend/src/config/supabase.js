import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    ' Error: SUPABASE_URL y SUPABASE_ANON_KEY deben estar configuradas en el archivo .env'
  );
}


export const supabase = createClient(supabaseUrl, supabaseKey);

console.log(' Cliente de Supabase configurado correctamente');
