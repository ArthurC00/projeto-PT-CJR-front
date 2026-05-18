import ProfilePage from "../ProfilePage";

interface ProfileParams {
  params: Promise<{
    userId: number;
  }>;
}

export default async function Profile({ params }: ProfileParams) {
  const { userId } = await params;

  return <ProfilePage userId={Number(userId)} />;
}
