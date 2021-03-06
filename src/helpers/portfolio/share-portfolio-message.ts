import portfolioMessages from '../../messages/portfolio.messages';
import { Bold } from '../../presentational-components/shared/intl-rich-text-components';
import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { AnyObject } from '../../types/common-types';

const groupMessage = (
  groupNames: string[],
  formatMessage: (message: MessageDescriptor, values?: AnyObject) => ReactNode
) => {
  switch (groupNames.length) {
    case 1:
      return groupNames[0];
    case 2:
      return formatMessage(portfolioMessages.shareSuccessTwoGroup, {
        group1: groupNames[0],
        group2: groupNames[1]
      });
    default:
      return formatMessage(portfolioMessages.shareSuccessMultipleGroups, {
        count: groupNames.length
      });
  }
};

// TODO This will be the form type
export interface SharePortfolioData {
  id?: string;
  group_uuid: string;
  permissions: string;
  groupName: string;
}
const sharePorfolioMessage = ({
  shareData,
  initialGroups,
  removedGroups,
  newGroups,
  formatMessage,
  portfolioName
}: {
  shareData: SharePortfolioData[];
  initialGroups: SharePortfolioData[];
  removedGroups: SharePortfolioData[];
  newGroups: SharePortfolioData[];
  formatMessage: (message: MessageDescriptor, values?: AnyObject) => ReactNode;
  portfolioName: (...args: any[]) => string | undefined;
}): { title: ReactNode; description: ReactNode } => {
  let title = formatMessage(portfolioMessages.shareSuccessTitle);
  let description;

  const changedPermissions = shareData.filter(({ permissions, group_uuid }) => {
    const originalGroup = initialGroups.find(
      (group) => group.group_uuid === group_uuid
    );

    return (
      originalGroup &&
      permissions?.split(',').length !==
        originalGroup.permissions?.split(',').length
    );
  });
  const unshared =
    removedGroups.filter(
      ({ group_uuid }) =>
        !changedPermissions.find((group) => group.group_uuid === group_uuid)
    ).length > 0;
  const shared =
    newGroups.filter(
      ({ group_uuid }) =>
        !initialGroups.find((group) => group.group_uuid === group_uuid)
    ).length > 0;

  if (unshared && !shared && changedPermissions.length === 0) {
    title = formatMessage(portfolioMessages.shareSuccessTitleOnlyUnsharing);
    description = formatMessage(
      portfolioMessages.shareSuccessDescriptionOnlyUnsharing,
      {
        name: portfolioName(),
        group: groupMessage(
          removedGroups.map(({ groupName }) => groupName),
          formatMessage
        ),
        b: Bold
      }
    );
  }

  if (!unshared && shared && changedPermissions.length === 0) {
    title = formatMessage(portfolioMessages.shareSuccessTitleOnlySharing);
    description = formatMessage(
      portfolioMessages.shareSuccessDescriptionOnlySharing,
      {
        name: portfolioName(),
        group: groupMessage(
          newGroups.map(({ groupName }) => groupName),
          formatMessage
        ),
        b: Bold
      }
    );
  }

  if (!unshared && !shared && changedPermissions.length > 0) {
    title = formatMessage(
      portfolioMessages.shareSuccessTitleOnlyChaningPermissions
    );
    description = formatMessage(
      portfolioMessages.shareSuccessDescriptionOnlyChaningPermissions,
      {
        group: groupMessage(
          changedPermissions.map(({ groupName }) => groupName),
          formatMessage
        ),
        b: Bold
      }
    );
  }

  return { title, description };
};

export default sharePorfolioMessage;
