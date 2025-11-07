-- Enable admin-only writes for key tables, keep public read policies intact
-- Uses auth.email() to match against public.admins (role='admin')

-- Helper condition reused in policies:
-- EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin')

-- EVENTS
CREATE POLICY "Admins can insert events"
ON public.events FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can update events"
ON public.events FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can delete events"
ON public.events FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

-- RESOURCES
CREATE POLICY "Admins can insert resources"
ON public.resources FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can update resources"
ON public.resources FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can delete resources"
ON public.resources FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

-- GALLERY EVENTS
CREATE POLICY "Admins can insert gallery_events"
ON public.gallery_events FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can update gallery_events"
ON public.gallery_events FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can delete gallery_events"
ON public.gallery_events FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

-- GALLERY IMAGES
CREATE POLICY "Admins can insert gallery_images"
ON public.gallery_images FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can update gallery_images"
ON public.gallery_images FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can delete gallery_images"
ON public.gallery_images FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

-- COUNCIL LEADERS
CREATE POLICY "Admins can insert council_leaders"
ON public.council_leaders FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can update council_leaders"
ON public.council_leaders FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can delete council_leaders"
ON public.council_leaders FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

-- MONTHLY AWARENESS
CREATE POLICY "Admins can insert monthly_awareness"
ON public.monthly_awareness FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can update monthly_awareness"
ON public.monthly_awareness FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

CREATE POLICY "Admins can delete monthly_awareness"
ON public.monthly_awareness FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = auth.email() AND a.role = 'admin'));

-- Add tables to Realtime publication for live updates (safe against duplicates)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_events;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.council_leaders;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.monthly_awareness;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;