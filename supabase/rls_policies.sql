-- CodeInternX - Comprehensive RLS Policies
-- Execute this script in your Supabase SQL Editor

-- 1. Helper Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (public.is_admin());

-- 3. Programs
DROP POLICY IF EXISTS "Published programs are viewable by everyone" ON programs;
DROP POLICY IF EXISTS "Admins can manage all programs" ON programs;

CREATE POLICY "Published programs are viewable by everyone" ON programs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage all programs" ON programs FOR ALL USING (public.is_admin());

-- 4. Tasks
DROP POLICY IF EXISTS "Anyone can view tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON tasks;

CREATE POLICY "Anyone can view tasks" ON tasks FOR SELECT USING (true); -- Usually tasks are visible if they are on a program
CREATE POLICY "Admins can manage all tasks" ON tasks FOR ALL USING (public.is_admin());

-- 5. Applications
DROP POLICY IF EXISTS "Students can view their own applications" ON applications;
DROP POLICY IF EXISTS "Students can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Students can update their own applications" ON applications;
DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;

CREATE POLICY "Students can view their own applications" ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own applications" ON applications FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all applications" ON applications FOR ALL USING (public.is_admin());

-- 6. Orders
DROP POLICY IF EXISTS "Students can view their own orders" ON orders;
DROP POLICY IF EXISTS "Students can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Students can update their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

CREATE POLICY "Students can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (public.is_admin());

-- 7. Payments
DROP POLICY IF EXISTS "Students can view their own payments" ON payments;
DROP POLICY IF EXISTS "Students can insert their own payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;

CREATE POLICY "Students can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can insert their own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all payments" ON payments FOR ALL USING (public.is_admin());

-- 8. Enrollments
DROP POLICY IF EXISTS "Students can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Students can insert their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Students can update their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

CREATE POLICY "Students can view their own enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own enrollments" ON enrollments FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all enrollments" ON enrollments FOR ALL USING (public.is_admin());

-- 9. Submissions
DROP POLICY IF EXISTS "Students can view their own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can create submissions" ON submissions;
DROP POLICY IF EXISTS "Students can update their own submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON submissions;

CREATE POLICY "Students can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own submissions" ON submissions FOR UPDATE USING (auth.uid() = student_id AND status = 'PENDING_REVIEW') WITH CHECK (auth.uid() = student_id AND status = 'PENDING_REVIEW');
CREATE POLICY "Admins can manage all submissions" ON submissions FOR ALL USING (public.is_admin());

-- 10. Evaluations
DROP POLICY IF EXISTS "Students can view their own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Admins can manage all evaluations" ON evaluations;

-- Students can view their evaluations by joining with submissions
CREATE POLICY "Students can view their own evaluations" ON evaluations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM submissions 
    WHERE submissions.id = evaluations.submission_id 
    AND submissions.student_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all evaluations" ON evaluations FOR ALL USING (public.is_admin());

-- 11. Certificates
DROP POLICY IF EXISTS "Public can verify certificates" ON certificates;
DROP POLICY IF EXISTS "Students can view their own certificates" ON certificates;
DROP POLICY IF EXISTS "Admins can manage all certificates" ON certificates;

CREATE POLICY "Public can verify certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Students can view their own certificates" ON certificates FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage all certificates" ON certificates FOR ALL USING (public.is_admin());
