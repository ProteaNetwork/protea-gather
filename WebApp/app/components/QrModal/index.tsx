/**
 *
 * QrModal
 *
 */

import React, { Fragment } from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { colors } from 'theme';
import { CloudDownload, Close } from '@material-ui/icons';
import { Fab } from '@material-ui/core';
import QRCode from 'qrcode.react';
import { renderToStaticMarkup } from 'react-dom/server';

const styles = (theme: Theme) => createStyles({
  close: {
    backgroundColor: `${colors.proteaBranding.pink} !important`,
    position: 'fixed',
    top: 15,
    right: 15
  },
  qrCode: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  },
  download:{
    backgroundColor: `${colors.proteaBranding.pink} !important`,
    position: 'fixed',
    bottom: 15,
    right: 15
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  qrData: string;
  onCloseQr(): void;
}

class QrModal extends React.Component<OwnProps> {
  public state = {
    dataUri: ""
  }
  public updateDataUri = () =>{
    const canvas: HTMLCanvasElement | any = document.querySelector('#qrArea canvas');
    this.setState({dataUri: canvas.toDataURL('image/jpg')})
  }

  public render() {
    const { classes, onCloseQr, qrData } = this.props;
    return (
      <Fragment>
        <Fab onClick={() => onCloseQr()} className={classes.close}>
          <Close />
        </Fab>
        {
          qrData &&  (<Fragment>
            <div id="qrArea" className={classes.qrCode}>
              <QRCode
                value={qrData ? qrData : 'Konami future'}
                size={250}
                level={'H'}
                bgColor={colors.white}
                fgColor={colors.proteaBranding.blackBg}
              />
            </div>
          </Fragment>)
        }
        <Fab href={this.state.dataUri} download={`${qrData}.png`} className={classes.download} onMouseEnter={() => this.updateDataUri()}>
          <CloudDownload />
        </Fab>
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(QrModal);
