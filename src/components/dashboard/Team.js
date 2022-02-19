import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Typography, Box, IconButton } from "@material-ui/core";
import * as _ from "underscore";
import { makeStyles } from "@material-ui/core/styles";
import { TEAM_ID, ID, DEFAULT_RESOURCE } from "constants/index";
import TeamOptions from "./TeamOptions";
import TeamDialog from "./TeamDialog";
import ResourceDialog from "containers/resources/dialog/ResourceDialog";
import { getTeams } from "redux/actions/teamAction";
import PopoverHover from "components/dashboard/Popover";
import { IMAGES_URL } from "constants/index";
import { storage } from "firebase/index";
import { setMessage } from "redux/actions/msgAction";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 8,
  },
  icon: {
    fontSize: 10,
    color: "black",
  },
  text: {
    fontSize: 12,
    fontWeight: 600,
    padding: 2,
  },
});

export default function Team({
  team = {},
  resources = [],
  handleRenameTeam,
  handleAddResource,
  setUploading,
  setOpenTeam,
  isOpenTeam,
  indexTeam = 0,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const storeTeams = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(getTeams(id));
  }, [id]);

  const classes = useStyles();

  const rscAmount = resources.filter(
    (resource) => _.get(resource, TEAM_ID) === _.get(team, ID)
  ).length;

  const [openRename, setOpenRename] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickOption = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOption = () => {
    setAnchorEl(null);
  };

  const handleOpenRenameTeam = () => {
    handleCloseOption();
    setOpenRename(true);
  };

  const [anchor, setAnchor] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchor(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchor(null);
  };

  const content = [[{ title: "TEAM", detail: _.get(team, "name") }]];

  const [resource, setResource] = useState(DEFAULT_RESOURCE);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setResource({ ...DEFAULT_RESOURCE, teamId: _.get(team, ID) });
    handleCloseOption();
    setIsOpenDialog(true);
  };

  const getUploadedImageUrl = async (avatarFile) => {
    return new Promise((resolve, reject) => {
      const uploadTask = storage
        .ref(`${IMAGES_URL}${avatarFile.name}`)
        .put(avatarFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploading(true);
        },
        (error) => {
          dispatch(setMessage(error));
          reject(error);
        },
        async () => {
          const imgURL = await uploadTask.snapshot.ref.getDownloadURL();
          resolve(imgURL);
          setUploading(false);
          return imgURL;
        }
      );
    });
  };

  const handleClose = () => {
    const temp = [...isOpenTeam];
    temp.splice(indexTeam, 1, !isOpenTeam[indexTeam]);
    setOpenTeam([...temp]);
  };

  return (
    <Box className={classes.container}>
      <Box
        className={classes.left}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <IconButton
          className={`${
            isOpenTeam[indexTeam] ? `fas fa-chevron-down` : `fas fa-chevron-up`
          } ${classes.icon}`}
          onClick={handleClose}
        ></IconButton>
        <Typography
          noWrap
          className={classes.text}
          style={{ pointerEvents: "none" }}
        >
          {team.name}
        </Typography>
        <Typography
          className={classes.text}
          style={{ pointerEvents: "none" }}
        >{`(${rscAmount})`}</Typography>
      </Box>

      <IconButton
        aria-controls={_.get(team, "id")}
        aria-haspopup="true"
        className={`fas fa-ellipsis-h ${classes.icon}`}
        onClick={handleClickOption}
      ></IconButton>
      <TeamOptions
        anchorEl={anchorEl}
        handleCloseOption={handleCloseOption}
        handleOpenRenameTeam={handleOpenRenameTeam}
        handleOpenDialog={handleOpenDialog}
      />

      <TeamDialog
        team={team}
        isOpenDialog={openRename}
        setOpenDialog={setOpenRename}
        handleRenameTeam={handleRenameTeam}
      />

      <ResourceDialog
        isOpenDialog={isOpenDialog}
        resource={resource}
        teams={storeTeams.data || []}
        setResource={setResource}
        setIsOpenDialog={setIsOpenDialog}
        callApiAddResource={handleAddResource}
        getUploadedImageUrl={getUploadedImageUrl}
      />
      <PopoverHover
        handlePopoverClose={handlePopoverClose}
        anchorEl={anchor}
        content={content}
      />
    </Box>
  );
}
