import Auth from "@/components/Auth/Auth";
import Chat from "@/components/Chat/Chat";
import { Box } from "@chakra-ui/react";
import { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  let renderView;
  
  function reloadSession() {}

  if (session?.user?.username) {
    renderView = <Chat />;
  } else {
    renderView = <Auth session={session} reloadSession={reloadSession} />;
  }

  return <Box>{renderView}</Box>;
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
