import { getMapServiceByName } from "lib/mapServices";
import MapService from "models/map-service";

const useMapServices = ({ names = [], services: userServices } = {}) => {
  const services = names.map(name => getMapServiceByName(name, userServices));

  return services.map(service => new MapService(service));
};

export default useMapServices;
