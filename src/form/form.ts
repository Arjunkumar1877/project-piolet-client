import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['UI/UX Designer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Project Manager', 'QA Engineer', 'DevOps Engineer', 'Product Manager'], {
    required_error: 'Please select a role',
  }),
  email: z.string().email('Invalid email address'),
});
export type MemberFormData = z.infer<typeof memberSchema>;

