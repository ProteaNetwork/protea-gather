/**
 *
 * MembersTab
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography } from '@material-ui/core';
import { IMember } from 'domain/membershipManagement/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    root:{
      display: "flex",
      flexDirection: 'row',
      margin: "5px 0",
      backgroundColor: colors.proteaBranding.blackBg,
      color: colors.white
    },
    profileImage:{
      display: 'block',
      width: "130px !important",
      height: "130px !important",
    },
    textRegion: {
      width: 'calc(100% - 130px)',
      padding: 20,
      color: colors.white,
      "& > *": {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: colors.white,
      }
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  member: IMember;
  stateMessage: string;
}

const MembersTab: React.SFC<OwnProps> = (props: OwnProps) => {
  const { member, classes, stateMessage} = props;
  return <Fragment>
    <section className={classes.root}>
      {
        member.profileImage ?
          <img  className={classes.profileImage} src={apiUrlBuilder.attachmentStream(member.profileImage)} />
          :
          <Blockies className={classes.profileImage}
                  seed={member.ethAddress}
                  size={30}
                  scale={4}
                  color={colors.proteaBranding.orange}
                  bgColor={colors.white}
                  spotColor={colors.proteaBranding.pink}

                />
      }
      <section className={classes.textRegion}>
        <Typography variant="h4" component="h3">
          {member.name ? member.name : member.ethAddress}
        </Typography>
        {
          stateMessage &&
          <Typography variant="h5" component="h3">
            {stateMessage}
          </Typography>
        }
      </section>
    </section>
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(MembersTab);
