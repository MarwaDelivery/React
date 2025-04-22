import React, { useEffect, useState } from "react";
import { Alert, Popover, Typography, Stack } from "@mui/material";
//import DeliveryAddress from "../../../checkout-page/DeliveryAddress";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import CustomAlert from "../../../alert/CustomAlert";
import MapModal from "../../../Map/MapModal";
import { CustomButtonPrimary } from "../../../../styled-components/CustomButtons.style";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { CustomTypography } from "../../../landing-page/hero-section/HeroSection.style";
import DeliveryAddress, {
  getZoneWiseAddresses,
} from "../../../checkout/delivery-address";
import { useGeolocated } from "react-geolocated";
import useGetAddressList from "api-manage/hooks/react-query/address/useGetAddressList";

const AddressReselectPopover = (props) => {
  const { anchorEl, onClose, open, t, address, setAddress, token, ...other } =
    props;
  const [openMapModal, setOpenMapModal] = useState(false);
  const [data, setData] = useState(null);
  const [allAddress, setAllAddress] = useState([]);
  const handleCloseMapModal = () => {
    setOpenMapModal(false);
    onClose();
  };
  const popOverHeightHandler = () => {
    if (token) {
      return "200px";
    } else {
      return "150px";
    }
  };
  const handleSuccess = (addressData) => {
    setData(addressData);
  };
  const { refetch, isRefetching, isLoading } = useGetAddressList(handleSuccess);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    // handleSize(data.total_size)
    data && setAllAddress([address, ...data.addresses]);
  }, [data]);
  const handleLatLng = (values) => {
    setAddress({ ...values, lat: values.latitude, lng: values.longitude });
  };
  return (
    <>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: { width: { xs: 300, sm: 320, md: 350 }, p: "1rem" },
        }}
        transitionDuration={2}
        {...other}
      >
        <Stack justifyContent="center" textAlign="center" spacing={1}>
          <SimpleBar
            style={{
              maxHeight: popOverHeightHandler(),
            }}
          >
            <Stack width="100%" alignItems="center">
              {token ? (
                open && (
                  <DeliveryAddress
                    setAddress={setAddress}
                    address={address}
                    allAddress={allAddress}
                    data={data}
                    hideAddressSelectionField="true"
                    renderOnNavbar="true"
                    handleLatLng={handleLatLng}
                  />
                )
              ) : (
                <CustomAlert
                  type="info"
                  text={t(
                    "To select from saved addresses, you need to sign in."
                  )}
                />
              )}
            </Stack>
          </SimpleBar>
          <CustomTypography>{t("Or")}</CustomTypography>
          <Stack width="100%" justifyContent="center" alignItems="center">
            <CustomButtonPrimary onClick={() => setOpenMapModal(true)}>
              {t("Pick from map")}
            </CustomButtonPrimary>
          </Stack>
        </Stack>
      </Popover>
      {openMapModal && (
        <MapModal open={openMapModal} handleClose={handleCloseMapModal} />
      )}
    </>
  );
};

AddressReselectPopover.propTypes = {};

export default AddressReselectPopover;
