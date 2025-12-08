package modules.service;


import modules.entity.LoginHistory;

import java.util.List;

public interface LoginHistoryService {


    LoginHistory saveCustomerLogin(String username);

    List<Object> getTodayLoginStats();

    List<Object> getYesterdayLoginStats();
}
