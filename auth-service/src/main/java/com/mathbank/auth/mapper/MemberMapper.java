package com.mathbank.auth.mapper;

import com.mathbank.auth.domain.Member;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    Member findByUsername(String username);
    void insert(Member member);
}
