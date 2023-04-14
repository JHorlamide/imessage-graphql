import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import React, { Fragment, useState } from "react";
import { useMutation } from "@apollo/client";
import UserOperations from "../../graphql/operations/user";
import {
  IAuthProps,
  ICreateUserVariable,
  ICreateUsernameData,
} from "../../utils/auth-types";

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const { createUsername } = UserOperations.Mutations;

  const [createUsernameMutation, { loading, error, data }] = useMutation<
    ICreateUsernameData,
    ICreateUserVariable
  >(createUsername);

  console.log({ data, loading, error });

  const onSubmit = async () => {
    if (!username) return;
    
    try {
      await createUsernameMutation({ variables: { username } });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const AuthorizedUser = (
    <Fragment>
      <Text fontSize={"3xl"} color="white">
        Create a Username
      </Text>
      
      <Stack spacing={4}>
        <Input
          color={"white"}
          width={"100%"}
          borderRadius="10px"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button onClick={onSubmit} border={"1px solid gray"} borderRadius="3xl">
          Save
        </Button>
      </Stack>
    </Fragment>
  );

  const UnAuthorizedUer = (
    <Fragment>
      <Text fontSize={"3xl"}>MessengerQL</Text>
      <Button
        borderRadius={"3xl"}
        onClick={() => signIn("google")}
        leftIcon={
          <Image height={"20px"} src="/image/google.png" alt="google-image" />
        }
      >
        Continue with Google
      </Button>
    </Fragment>
  );

  return (
    <Center height={"100vh"}>
      <Stack spacing={8} align={"center"}>
        {session ? AuthorizedUser : UnAuthorizedUer}
      </Stack>
    </Center>
  );
};

export default Auth;
