/**
 *
 * MembersActionTab
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography } from '@material-ui/core';
import { IMember } from 'domain/membershipManagement/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { colors } from 'theme';
import classNames from 'classnames';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    root:{
      display: "flex",
      flexDirection: 'row',
      margin: "5px 0",
      backgroundColor: colors.proteaBranding.blackBg,
      color: colors.white,
      cursor: "pointer",
      position: "relative",
      "&:after":{
        content: "''",
        position: "absolute",
        height: "100%",
        width: "100%",
        transitionDuration: "200ms",
        top: 0,
        left: 0,
        zIndex: 999
      },
      "&.confirmed":{
        cursor: "default",
      },
      "&.highlighted":{
        "&:after":{
          backgroundColor: fade(colors.proteaBranding.pink, 0.5)
        }
      }
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
    },
  });

interface OwnProps extends WithStyles<typeof styles> {
  member: IMember;
  stateMessage: string;
  confirmed: boolean;
  highlighted: boolean;
  action(): void;
}

const MembersActionTab: React.SFC<OwnProps> = (props: OwnProps) => {
  const { confirmed, action, member, classes, stateMessage, highlighted} = props;
  const actionManage = () => {
    !confirmed ? action() : undefined;
  }
  return <Fragment>
    <section className={classNames(classes.root, {
      "confirmed": confirmed , "highlighted": highlighted
    })} onClick={() => actionManage()}>
      <div>
        {
          member.profileImage ?
            <img  className={classes.profileImage} src={apiUrlBuilder.attachmentStream(member.profileImage)} />
            :
            <Blockies className={classes.profileImage}
                    seed={member.ethAddress ? member.ethAddress : "0x"}
                    size={30}
                    scale={4}
                    color={colors.proteaBranding.orange}
                    bgColor={colors.white}
                    spotColor={colors.proteaBranding.pink}

                  />
        }
      </div>
      <section className={classes.textRegion}>
        <Typography variant="h4" component="h3">
          {member.displayName ? member.displayName : member.ethAddress}
        </Typography>
        {
          stateMessage &&
          <Typography variant="subtitle1" component="h3">
            {stateMessage}
          </Typography>
        }
      </section>
    </section>
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(MembersActionTab);
