package modules.service;

import modules.entity.Address;
import modules.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();

    User findById(String id);

    Address addAddress(String userId, Address address);

    boolean deleteAddress(String userId, String addressId);

    Address updateAddress(String userId, String addressId, Address updatedAddress);
}
