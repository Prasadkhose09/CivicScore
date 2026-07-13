package com.civicscore.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor@AllArgsConstructor
public class Incentive {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long incentiveId;

    private String name;

    private  int minScore;

    private String description;

}
