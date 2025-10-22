-- Create a function to check the number of admin roles
CREATE OR REPLACE FUNCTION check_admin_role_limit()
RETURNS TRIGGER AS $
BEGIN
    IF (SELECT COUNT(*) FROM admins WHERE role = 'admin') >= 2 THEN
        RAISE EXCEPTION 'Cannot have more than two admin roles.';
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Enforce the limit on INSERT operations
CREATE POLICY "Admins INSERT policy: restrict to 2 admin roles"
ON admins FOR INSERT WITH CHECK (
    (SELECT COUNT(*) FROM admins WHERE role = 'admin') < 2 OR NEW.role <> 'admin'
);

-- Enforce the limit on UPDATE operations
CREATE POLICY "Admins UPDATE policy: restrict to 2 admin roles"
ON admins FOR UPDATE WITH CHECK (
    (SELECT COUNT(*) FROM admins WHERE role = 'admin') < 2 OR (OLD.role = 'admin' AND NEW.role = 'admin') OR (OLD.role <> 'admin' AND NEW.role <> 'admin')
);

-- Enable RLS on the admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read admin data (adjust as needed)
CREATE POLICY "Allow authenticated users to read admins" ON admins FOR SELECT TO authenticated USING (true);

-- Allow admins to update their own data (excluding role changes that violate the limit)
CREATE POLICY "Allow admins to update their own data" ON admins FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Allow admins to delete their own data
CREATE POLICY "Allow admins to delete their own data" ON admins FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION check_admin_role_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.admins WHERE role = 'admin') < 2;
END;
$$;

-- Create RLS policy to limit admin role creation to two
CREATE POLICY "Limit admin role creation to two"
ON public.admins FOR INSERT WITH CHECK (
  (SELECT COUNT(*) FROM public.admins WHERE role = 'admin') < 2
);

-- Create RLS policy to limit admin role updates to two
CREATE POLICY "Limit admin role updates to two"
ON public.admins FOR UPDATE USING (
  (SELECT COUNT(*) FROM public.admins WHERE role = 'admin') < 2 OR role = OLD.role
);