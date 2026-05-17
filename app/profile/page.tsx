"use client";

import ProfilePageOut from "./ProfilePageOut";

export default function Profile() {
  const verifyAuth = true;
  return <ProfilePageOut isOwner={verifyAuth} />;
}
