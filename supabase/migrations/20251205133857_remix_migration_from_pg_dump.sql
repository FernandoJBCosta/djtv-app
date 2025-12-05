CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: device_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    platform text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT device_tokens_platform_check CHECK ((platform = ANY (ARRAY['ios'::text, 'android'::text, 'web'::text])))
);


--
-- Name: dj_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dj_videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dj_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail_url text,
    duration_seconds integer,
    category text,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: djs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.djs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    bio text,
    banner_url text,
    profile_image_url text,
    instagram_url text,
    facebook_url text,
    soundcloud_url text,
    spotify_url text,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    push_enabled boolean DEFAULT true NOT NULL,
    new_content boolean DEFAULT true NOT NULL,
    live_streams boolean DEFAULT true NOT NULL,
    dj_updates boolean DEFAULT false NOT NULL,
    events boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    body text,
    data jsonb DEFAULT '{}'::jsonb,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone
);


--
-- Name: device_tokens device_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_pkey PRIMARY KEY (id);


--
-- Name: device_tokens device_tokens_user_id_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_user_id_token_key UNIQUE (user_id, token);


--
-- Name: dj_videos dj_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dj_videos
    ADD CONSTRAINT dj_videos_pkey PRIMARY KEY (id);


--
-- Name: djs djs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.djs
    ADD CONSTRAINT djs_pkey PRIMARY KEY (id);


--
-- Name: djs djs_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.djs
    ADD CONSTRAINT djs_slug_key UNIQUE (slug);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_key UNIQUE (user_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: idx_dj_videos_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dj_videos_category ON public.dj_videos USING btree (category);


--
-- Name: idx_dj_videos_dj_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dj_videos_dj_id ON public.dj_videos USING btree (dj_id);


--
-- Name: idx_dj_videos_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dj_videos_featured ON public.dj_videos USING btree (is_featured);


--
-- Name: idx_djs_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_djs_featured ON public.djs USING btree (is_featured);


--
-- Name: idx_djs_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_djs_slug ON public.djs USING btree (slug);


--
-- Name: device_tokens update_device_tokens_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_device_tokens_updated_at BEFORE UPDATE ON public.device_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: dj_videos update_dj_videos_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_dj_videos_updated_at BEFORE UPDATE ON public.dj_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: djs update_djs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_djs_updated_at BEFORE UPDATE ON public.djs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: notification_preferences update_notification_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: dj_videos dj_videos_dj_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dj_videos
    ADD CONSTRAINT dj_videos_dj_id_fkey FOREIGN KEY (dj_id) REFERENCES public.djs(id) ON DELETE CASCADE;


--
-- Name: dj_videos Anyone can view DJ videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view DJ videos" ON public.dj_videos FOR SELECT USING (true);


--
-- Name: djs Anyone can view DJs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view DJs" ON public.djs FOR SELECT USING (true);


--
-- Name: notification_preferences Users can create their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own preferences" ON public.notification_preferences FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: device_tokens Users can delete their own device tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own device tokens" ON public.device_tokens FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: device_tokens Users can insert their own device tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own device tokens" ON public.device_tokens FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: notification_preferences Users can update their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own preferences" ON public.notification_preferences FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: device_tokens Users can view their own device tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own device tokens" ON public.device_tokens FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (((auth.uid() = user_id) OR (user_id IS NULL)));


--
-- Name: notification_preferences Users can view their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own preferences" ON public.notification_preferences FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: device_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: dj_videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dj_videos ENABLE ROW LEVEL SECURITY;

--
-- Name: djs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.djs ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


