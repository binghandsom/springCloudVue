package com.service;

import com.entity.User;

/**
 * Created by WTON on 2017/5/16.
 */
public interface IUserService {

    User findById(Integer id);

    String register(User user);

    String login(User user);


}