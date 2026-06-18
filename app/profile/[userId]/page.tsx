import ProfilePage from "../../produto/ProfilePage";

interface ProfileParams {
  params: Promise<{
    userId: string;
  }>;
}

export default async function Profile({ params }: ProfileParams) {
  const { userId } = await params;

  return <ProfilePage userId={Number(userId)} />;
}
