"use client";

import PermissionGroupList from "@/app/components/apps/permission-group/PermissionGroupList";
import PageContainer from "@/app/components/container/PageContainer";

function PermissionGroup() {
  return (
    <PageContainer title="PermissionGroup" description="PermissionGroup">
      <PermissionGroupList />
    </PageContainer>
  );
}

export default PermissionGroup;
