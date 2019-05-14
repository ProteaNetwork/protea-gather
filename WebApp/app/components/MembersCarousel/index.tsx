/**
 *
 * MembersCarousel
 *
 */

import { Fab, Paper, Theme, withWidth } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import MemberCard from 'components/MemberCard';
import React, { Fragment } from 'react';
import Slider, { Settings as SliderSettings } from 'react-slick';
import { compose } from 'redux';
import { ChevronRight, ChevronLeft } from '@material-ui/icons';
import { colors } from 'theme';
import { IMember } from 'domain/membershipManagement/types';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block',
    padding: "20px",
    [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
      padding: "20px",
    },
  },
  label:{
    marginTop: 10
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
    marginTop: `${spacing.unit * 2}px`,
    marginBottom: `${spacing.unit * 2}px`,
  },
  innerCarousel: {
    marginTop: 20,
    paddingTop: "10px",
    paddingBottom: 40,
    '&> *':{
      outline: 'none'
    },
    '& .slick-slide > * > * > *': {
      width: 'calc(100% - 20px)',
      margin: '0 auto',
    },
  },
  carouselDots: {
    width: '100%',
    position: 'absolute',
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 18,
    padding: 0,
    '& > li': {
      display: 'block',
      width: 10,
      height: 10,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: 'black',
      margin: '0 5px',
      opacity: 0.5,
      transitionDuration: '200ms',
      '& > *': {
        cursor: 'pointer',
        margin: 0,
        display: 'block',
        height: '100%',
        width: '100%',
        padding: 0,
      },
      '&:hover': {
        opacity: 1,
      },
    },
  },
});

interface OwnProps {
  classes: any;
  members: IMember[];
  width: Breakpoint;
}

function FabNext(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
    // className={className}
    style={{...style,
            display: 'block',
            position: 'absolute',
            top: '50%',
            transform: 'translate(50%,-50%)',
            right: '20px',
            color: colors.white,
            backgroundColor: colors.proteaBranding.pink}}
      onClick={onClick}>
      <ChevronRight  fontSize={"large"}/>
    </Fab>
  );
}

function FabPrevious(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
      style={{...style,
              display: 'block',
              position: 'absolute',
              top: '50%',
              transform: 'translate(-50%,-50%)',
              left: '20px',
              zIndex: '1',
              color: colors.white,
              backgroundColor: colors.proteaBranding.pink}}
      onClick={onClick} >
    <ChevronLeft fontSize={"large"} />
    </Fab>
  );
}

const MembersCarousel: React.SFC<OwnProps> = (props: OwnProps) => {
  const { classes, members, width } = props;

  const getCarouselSlidesToShow = () => {
    if (isWidthUp('xl', width)) {
      return 4;
    }

    if (isWidthUp('lg', width)) {
      return 3;
    }

    if (isWidthUp('md', width)) {
      return 2;
    }

    return 1;
  };

  const sliderSettings: SliderSettings = {
    className: classes.innerCarousel,
    centerPadding: '60px',
    arrows: true,
    dots: true,
    dotsClass: classes.carouselDots,
    slidesToShow: getCarouselSlidesToShow(),
    slidesToScroll: 1,
    infinite: true,
    centerMode: true,
    prevArrow: <FabPrevious />,
    nextArrow: <FabNext />,
    appendDots: dots => (
      <ul> {dots} </ul>
    ),
  };

  return (
    <Fragment>
      <Slider {...sliderSettings}>
        {
          members && members.map((member: IMember) =>
            <div key={member.ethAddress}>
              <MemberCard {...member} />
            </div>
          )
        }
      </Slider>
    </Fragment>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(MembersCarousel);
