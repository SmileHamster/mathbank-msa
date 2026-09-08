package com.mathbank.attempt.controller;

import com.mathbank.attempt.common.response.ApiResponse;
import com.mathbank.attempt.domain.Student;
import com.mathbank.attempt.dto.StudentFormDto;
import com.mathbank.attempt.dto.StudentListDto;
import com.mathbank.attempt.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ApiResponse<List<StudentListDto>> list() {
        return ApiResponse.success(studentService.getStudentList());
    }

    @PostMapping
    public ApiResponse<Long> create(@RequestBody @Valid StudentFormDto form) {
        return ApiResponse.success(studentService.createStudent(form));
    }

    @GetMapping("/{id}")
    public ApiResponse<Student> detail(@PathVariable Long id) {
        return ApiResponse.success(studentService.getStudent(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody @Valid StudentFormDto form) {
        studentService.updateStudent(id, form);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ApiResponse.success(null);
    }
}
