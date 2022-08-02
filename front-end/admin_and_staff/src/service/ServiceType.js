import serviceTypeApi from "api/serviceTypeApi";

class ServiceTypeService {
    fetchServiceTypeList = async () => {
        try {
          const response = await serviceTypeApi.getAll();
          console.log(response);
        return response;
        } catch (error) {
          console.log("Fetch service list failed", error);
        }
        return null;
    };
}


export default ServiceTypeService;
