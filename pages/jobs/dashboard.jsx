import { Box, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import Account from "@/components/Account";
import Auth from "@/components/Auth";
import JobList from "@/components/JobList";
import TextPageHeader from "@/components/TextPageHeader";
import { useUserContext } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/";

export default function Dashboard() {
  const { user } = useUserContext();
  const [userEntries, setUserEntries] = useState({ data: [] });

  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (user) {
      supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("inserted_at", { ascending: false })
        .then(setUserEntries);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Job Dashboard | Denver Devs</title>
        <meta
          name="description"
          content={`Manage your jobs on the free Denver Devs job board`}
        />
        <meta property="og:title" content={"Jobs | Denver Devs"} />
        <meta
          property="og:description"
          content={`Manage your jobs on the free Denver Devs job board`}
        />
        <meta property="og:url" content={`https://denverdevs.org/dashboard/`} />
        <meta property="og:type" content="website" />
      </Head>
      <Box marginTop={["24", "32"]}>
        {!session ? (
          <Auth />
        ) : (
          <Box
            marginTop={{ base: "20", xl: "28" }}
            marginBottom={{ base: "6", xl: "20" }}
          >
            <Box my="10">
              <TextPageHeader text="Your Dashboard" />
              <Flex
                flexDirection={{ base: "column", md: "row" }}
                marginTop="4"
                mx={{ base: "2", xl: "8" }}
              >
                <Box flex="auto" marginRight={{ base: "0", md: "10" }}>
                  <Heading as="h3" my="4" fontSize="xl">
                    Your job posts
                  </Heading>
                  <JobList jobs={userEntries.data} />
                </Box>
                <Box
                  flex="auto"
                  maxWidth={{ base: "100%", lg: "400px" }}
                  marginBottom={{ base: "10", lg: "0" }}
                  marginLeft="8"
                >
                  <Heading as="h3" my="4" fontSize="xl">
                    Your Account
                  </Heading>
                  <Account key={session.user.id} session={session} />
                </Box>
              </Flex>
            </Box>
          </Box>
        )}{" "}
      </Box>
    </>
  );
}
