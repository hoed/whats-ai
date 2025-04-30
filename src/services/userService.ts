
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Default user ID for development
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

// Get current user ID - in a real app would come from auth context
export const getCurrentUserId = () => {
  // This is a placeholder, in a real app you would get this from auth context
  return DEFAULT_USER_ID;
};

// Ensure user_settings exists for current user
export const ensureUserSettings = async (userId: string) => {
  // Check if settings exist
  const { data: existingSettings, error: fetchError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (fetchError) {
    console.error("Error checking user settings:", fetchError);
    throw fetchError;
  }
  
  // If no settings exist, create them
  if (!existingSettings) {
    const { error: createError } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        dark_mode: false,
        notifications: true,
        language: 'id'
      });
    
    if (createError) {
      console.error("Error creating user settings:", createError);
      throw createError;
    }
  }
  
  return true;
};

// Hook utility to get user settings
export const useUserService = () => {
  const { user } = useAuth();
  const userId = user?.id || DEFAULT_USER_ID;
  
  const createEntity = async <T extends { user_id?: string }>(
    table: string, 
    data: Omit<T, 'user_id'>
  ) => {
    // Add user_id to the data
    const dataWithUserId = {
      ...data,
      user_id: userId
    };
    
    // Insert the data
    const { data: result, error } = await supabase
      .from(table)
      .insert(dataWithUserId)
      .select()
      .single();
      
    if (error) throw error;
    return result;
  };
  
  return {
    userId,
    createEntity,
    ensureUserSettings: () => ensureUserSettings(userId)
  };
};

export default useUserService;
