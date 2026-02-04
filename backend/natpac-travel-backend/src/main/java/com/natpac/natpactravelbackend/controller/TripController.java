package com.natpac.natpactravelbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.natpac.natpactravelbackend.model.Trip;
import com.natpac.natpactravelbackend.repository.TripRepository;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    private final TripRepository tripRepository;

    public TripController(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

@PostMapping
    public Trip saveTrip(@RequestBody Trip trip) {
    System.out.println("Receied Trip Data:");
    System.out.println("Origin: " + trip.getOrigin());
    System.out.println("Destination: " + trip.getDestination());
    System.out.println(trip.getOriginLat() + ", " + trip.getOriginLng());
System.out.println(trip.getDestinationLat() + ", " + trip.getDestinationLng());
System.out.println(trip.getMode());
System.out.println(trip.getDistance());

    return tripRepository.save(trip);
}

  
    @GetMapping("/user/{userId}")
    public List<Trip> getTripsByUser(@PathVariable String userId) {
        return tripRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripRepository.deleteById(id);
    }
}


