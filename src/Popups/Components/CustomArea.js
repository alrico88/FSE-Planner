import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import L from "leaflet";
import "leaflet-path-transform";

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  popup: {
    height: '90vh'
  },
  popupContent: {
    display: 'flex'
  }
}));


function Map({mapCenter, bounds, setBounds}) {

  const mapRef = React.useRef(null);
  const rectangleRef = React.useRef(null);

  // Initialize map and center on bounds
  React.useEffect(() => {
    const newBounds = bounds || L.latLngBounds([[51.310, 8.496], [42.200, -5.065]]);
    setBounds(newBounds);
    if (!mapRef.current) {
      // Create map
      mapRef.current = L.map('customArea', {
        minZoom: 3,
        bounds: newBounds,
        boundsOptions: { animate:false },
        attributionControl: false,
      });
      mapRef.current.fitBounds(newBounds);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
      // Create draggable and resizable rectangle
      rectangleRef.current = L.rectangle(newBounds, {transform: true, draggable: true});
      rectangleRef.current.addTo(mapRef.current);
      rectangleRef.current.transform.enable({rotation: false, scaling: true, uniformScaling: false});
      rectangleRef.current.dragging.enable();
      rectangleRef.current.on('transformed', () => setBounds(rectangleRef.current.getBounds()));
    }
    else {
      mapRef.current.fitBounds(newBounds);
      rectangleRef.current.setBounds(newBounds);
    }
  }, [bounds, setBounds]);

  // Update max bounds
  React.useEffect(() => {
    mapRef.current.setMaxBounds([[-90, mapCenter-180], [90, mapCenter+180]]);
  }, [mapCenter]);

  return (<div id="customArea"></div>);
}



function CustomAreaPopup(props) {

  const [bounds, setBounds] = React.useState(null);
  const classes = useStyles();

  return (
    <Dialog onClose={props.handleClose} open={props.open} fullWidth={true} maxWidth="lg" classes={{paper: classes.popup}}>
      <DialogTitle>
        Select custom area
        <IconButton className={classes.closeButton} onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.popupContent}>
        <Map
          mapCenter={props.settings.display.map.center}
          bounds={props.bounds}
          setBounds={setBounds}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {props.setArea(bounds); props.handleClose();}} color="primary" variant="contained">
          Add selected area
        </Button>
      </DialogActions>
    </Dialog>
  );

}

export default CustomAreaPopup;
