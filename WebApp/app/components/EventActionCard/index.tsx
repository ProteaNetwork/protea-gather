/**
 *
 * EventActionCard
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import EventCard from 'components/EventCard';
import { colors } from 'theme';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    cardRoot:{
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: colors.white,
      alignItems: "center",
      width: "100%",
      height: 200,
      "& > *":{
        maxHeight: 200,
        width: "50%"
      },
      "& button > *:nth-child(2)":{
        height: 150
      },
      "& button > *:nth-child(3)":{
        padding: 10,
        "& > *":{
          margin: 0,
        }
      }
    },
    actionButton:{
      color: colors.proteaBranding.black,
      textTransform: "uppercase",
      textAlign: "center",
      fontSize: 20,
      cursor: "pointer",
      transitionDuration: "200ms",
      height: "100%",
      fontWeight: "bold",
      position: "relative",
      "&:hover":{
        color: colors.proteaBranding.pink
      },
      "& span":{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)"
      }
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  action(): void;
  actionText: string;
  name: string;
  eventId: string;
  bannerImage: string;
  comLogo: string;
  communityName: string;
}

const EventActionCard: React.SFC<OwnProps> = (props: OwnProps) => {
  const {classes, communityName, actionText, action, name, eventId, bannerImage, comLogo} = props;
  return <div className={classes.cardRoot}>
    <EventCard
      bannerImage={bannerImage}
      name={name}
      comLogo={comLogo}
      displayCommunityName={true}
      eventId={eventId}
      communityName={communityName}
    ></EventCard>
    <div className={classes.actionButton} onClick={()=> action()}>
      <span>
        {actionText}
      </span>
    </div>
  </div>;
};

export default withStyles(styles, { withTheme: true })(EventActionCard);
