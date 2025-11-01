package modules.service.impl;

import modules.entity.Account;
import modules.entity.Address;
import modules.entity.User;
import modules.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements modules.service.UserService {
    private final UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public User findById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Address addAddress(String userId, Address address) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) return null;

        List<Address> addresses = user.getAddresses();
        if (addresses == null) addresses = new ArrayList<>();

        if (address.isDefault()) {
            addresses.forEach(a -> a.setDefault(false));
        }

        addresses.add(address);
        user.setAddresses(addresses);
        repository.save(user);

        return address;
    }

    public boolean deleteAddress(String userId, String addressId) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) return false;

        Address toRemove = user.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElse(null);

        if (toRemove == null) return false;

        user.getAddresses().remove(toRemove);
        repository.save(user);
        return true;
    }

    @Override
    public Address updateAddress(String userId, String addressId, Address updatedAddress) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) return null;

        List<Address> addresses = user.getAddresses();
        if (addresses == null) return null;

        Address toEdit = addresses.stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElse(null);

        if (toEdit == null) return null;

        if (updatedAddress.isDefault()) {
            addresses.forEach(a -> a.setDefault(false));
        }

        toEdit.setStreet(updatedAddress.getStreet() != null ? updatedAddress.getStreet() : toEdit.getStreet());
        toEdit.setCity(updatedAddress.getCity() != null ? updatedAddress.getCity() : toEdit.getCity());
        toEdit.setPhoneNumber(updatedAddress.getPhoneNumber() != null ? updatedAddress.getPhoneNumber() : toEdit.getPhoneNumber());
        toEdit.setDefault(updatedAddress.isDefault());

        repository.save(user);
        return toEdit;
    }


}
