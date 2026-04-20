// =====================================================
// SEA TREE — Translations
// All text content in 4 languages: EN, ES, GR, FR
// =====================================================

const translations = {
  en: {
    // Meta / head tags (used by the per-locale build step)
    meta: {
      title: "Sea Tree | Vacation Rental in Paros, Greece",
      description: "Sea Tree — a unique vacation rental in Aliki Beach, Paros, Greece. The former legendary Romantica disco bar, transformed into a serene island retreat.",
      ogTitle: "Sea Tree | Vacation Rental in Paros, Greece",
      ogDescription: "From dance floor to dream stay — Sea Tree, a unique vacation rental in Aliki Beach, Paros. The former legendary Romantica disco bar, transformed into a serene island retreat.",
      twitterTitle: "Sea Tree | Paros, Greece",
      twitterDescription: "From dance floor to dream stay — Sea Tree, vacation rental in Aliki Beach, Paros."
    },

    // Accessibility
    a11y: {
      skipToMain: "Skip to main content"
    },

    // Sticky mobile booking bar
    mobileBar: {
      checkAvailability: "Check Availability",
      whatsappAria: "Message us on WhatsApp"
    },

    // Navigation
    nav: {
      story: "Our Story",
      gallery: "Gallery",
      reviews: "Reviews",
      amenities: "Amenities",
      location: "Location",
      availability: "Availability",
      contact: "Contact"
    },

    // Hero
    hero: {
      title: "Sea Tree",
      tagline: "Slow down. Breathe. Be.",
      location: "Aliki Beach, Paros, Greece",
      checkAvailability: "Check Availability",
      ourStory: "Our Story"
    },

    // Story Section
    story: {
      label: "Our Story",
      title: "Where the Party Vibes Became Quiet Mornings",
      p1: "This blue house was once the Romantica disco bar — the heartbeat of Paros nightlife where islanders and travelers danced until sunrise.",
      p2: "Today, those same walls hold a different rhythm. Morning light through white curtains. Coffee on the balcony. Stone floors cool underfoot. The soul of Romantica lives on — in the sound of waves, the salt air, and the slow pace of island life.",
      highlight: {
        title: "A Touch of History",
        text: "Ask the locals about Romantica — they'll smile and share stories of the island's best parties. Now it's your turn to create quieter memories."
      }
    },

    // Gallery
    gallery: {
      label: "Gallery",
      title: "The Space",
      subtitle: "Natural light. Stone floors. Cotton linens. Room to breathe."
    },

    // Reviews
    reviews: {
      label: "Guest Reviews",
      title: "What guests say",
      subtitle: "Real visitors, real stays — pulled from our Airbnb, Google, and Booking.com pages.",
      moreAirbnb: "See more on Airbnb →"
    },

    // Amenities
    amenities: {
      label: "Amenities",
      title: "What We Provide",
      subtitle: "Simple, quality essentials for your stay",
      items: {
        wifi: { title: "Starlink Internet", desc: "Reliable high-speed connection" },
        ac: { title: "Air Conditioning", desc: "In every room" },
        kitchen: { title: "Full Kitchen", desc: "Cook with local ingredients" },
        parking: { title: "Free Public Parking", desc: "Street parking available" },
        terrace: { title: "Large Balcony", desc: "Southeast views, morning light" },
        washer: { title: "Washing Machine", desc: "For longer stays" },
        linens: { title: "100% Cotton Linens", desc: "Clean towels & bedding" },
        beach: { title: "Sea Towels", desc: "Provided for your beach days" }
      }
    },

    // The Space (selling points)
    theSpace: {
      label: "The Space",
      title: "Room to Breathe",
      subtitle: "A place designed for rest and slow mornings",
      items: {
        bathrooms: { title: "2 Bathrooms", desc: "One en-suite, one shared" },
        yoga: { title: "Yoga Room", desc: "Dedicated space for practice" },
        balcony: { title: "Large Balcony", desc: "Southeast facing, morning sun" }
      }
    },

    // Bedrooms
    bedrooms: {
      label: "Sleeping",
      title: "Restful Retreats",
      subtitle: "Comfortable spaces for sweet island dreams",
      room1: {
        title: "Master Bedroom",
        desc: "King-size bed, sea views, en-suite bathroom"
      },
      room2: {
        title: "Guest Bedroom",
        desc: "Two single beds, perfect for friends or kids"
      }
    },

    // Beach Access
    beach: {
      label: "Good to Know",
      title: "About Our Beach",
      warningTitle: "⚠️ Honest Note",
      warning: "Our beach access involves a rocky path and natural stone coastline. It's absolutely stunning and pristine — but we want you to know:",
      points: [
        "The path has uneven terrain (not suitable for wheelchairs)",
        "Best to bring water shoes for comfort",
        "Large suitcases may be tricky on arrival"
      ],
      altTitle: "🏖️ Prefer Sandy Beaches?",
      altIntro: "No worries! Beautiful sandy beaches nearby:",
      alt1: "Aliki Sandy Beach — 1 minute walk",
      alt2: "Piso Aliki Beach — 5 minute walk",
      alt3: "Agios Nikolaos — 10 minute drive"
    },

    // Location
    location: {
      label: "Location",
      title: "In the Heart of Aliki",
      subtitle: "A quiet village in south Paros",
      distances: {
        port: { label: "Parikia Port", value: "12 km (15 min)" },
        airport: { label: "Paros Airport", value: "2 km (5 min)" },
        village: { label: "Aliki Village", value: "2 min walk" },
        market: { label: "Supermarket", value: "5 min walk" },
        naousa: { label: "Naousa (nightlife)", value: "22 km (25 min)" }
      }
    },

    // Neighborhood
    neighborhood: {
      label: "Eat & Explore",
      title: "Your Neighborhood in Aliki",
      subtitle: "Four family tavernas within walking distance. Fresh fish. Honest cooking.",
      nightlife: "Prefer nightlife? Naousa is 25 minutes by car — the island's liveliest village.",
      tavernas: {
        mouragio: { name: "To Mouragio", desc: "Waterfront, fresh seafood, family-run for 30 years", distance: "2 min walk" },
        aliki: { name: "Aliki Restaurant", desc: "Greek classics, family recipes since 1974", distance: "3 min walk" },
        thalassamou: { name: "Thalassamou", desc: "Beachfront tables, grilled fish", distance: "4 min walk" },
        balcony: { name: "To Balcony tou Aki", desc: "Local fisherman's catch, simple and fresh", distance: "5 min walk" }
      }
    },

    // Calendar/Availability
    calendar: {
      label: "Availability",
      title: "Plan Your Stay",
      subtitle: "Check our availability and book your perfect dates",
      available: "Available",
      booked: "Booked",
      months: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },

    // FAQ
    faq: {
      label: "Frequently Asked",
      title: "Questions, answered",
      subtitle: "What guests ask before they book — in one place.",
      q1: {
        q: "How do I get from Paros port to Aliki?",
        a: "By car, 15 minutes. By bus, 25–35 minutes on the KTEL Paros line with a stop in Aliki village. Taxis are available at the port. If you're flying in, Paros airport is 5 minutes from Sea Tree."
      },
      q2: {
        q: "Is Sea Tree family-friendly?",
        a: "Yes. Two bedrooms sleep up to four; the terrace is fully fenced from the water so kids can play freely. Bring water shoes — the immediate coast is rocky; Aliki sandy beach is one minute on foot."
      },
      q3: {
        q: "What's the check-in process?",
        a: "Self-check-in from 15:00. Yorgos or his assistant will meet you in person on request; otherwise you'll get key details by message the morning of arrival."
      },
      q4: {
        q: "Can I leave bags before 15:00 or after 11:00?",
        a: "Yes — drop them off from noon onward on arrival day, and leave them until your ferry on departure day. No extra charge."
      },
      q5: {
        q: "Is there parking?",
        a: "Free public parking on the street outside. Aliki has more than enough spots except the first two weeks of August."
      },
      q6: {
        q: "Is the beach sandy?",
        a: "The coast directly in front of Sea Tree is natural stone — dramatic at sunset, not barefoot-friendly. For sand: Aliki main beach is a 1-minute walk, Piso Aliki 5 minutes, Agios Nikolaos 10 minutes by car."
      },
      q7: {
        q: "Pet policy?",
        a: "Sorry — no pets. It's a cleaning and allergy decision for future guests."
      },
      q8: {
        q: "How far is the nightlife?",
        a: "Naousa, the island's late-night hub, is 22 km / 25 minutes by car. Parikia is 12 km / 15 minutes. Aliki itself is intentionally quiet — tavernas run late but no clubs."
      },
      q9: {
        q: "What's the WiFi speed?",
        a: "Starlink: typically 150–250 Mbps down, 15–30 Mbps up, under 60 ms latency. Good enough for video calls and remote work."
      },
      q10: {
        q: "Is there electric-car charging nearby?",
        a: "Closest fast charger is in Parikia, 12 km / 15 minutes. A few Level-2 AC chargers at hotels in Naousa. No public charger in Aliki village yet."
      },
      q11: {
        q: "Pharmacy and medical care?",
        a: "Small pharmacy in Aliki village, 3 minutes on foot. Larger pharmacies and a medical center in Parikia. The Paros Health Center (24/7 emergency) is 15 minutes by car."
      },
      q12: {
        q: "Does the supermarket take card?",
        a: "Yes — both the market in Aliki and the larger ones in Parikia accept cards. Bring some cash for smaller tavernas and the odd island kiosk."
      }
    },

    // Booking/Contact
    booking: {
      label: "Book Your Stay",
      title: "Ready to Experience Sea Tree?",
      subtitle: "Get in touch or book directly through your favorite platform",
      formTitle: "Send Us a Message",
      name: "Your Name",
      email: "Email Address",
      dates: "Preferred Dates",
      guests: "Number of Guests",
      message: "Your Message",
      newsletter: "Send me occasional Paros tips & availability updates",
      send: "Send Inquiry",
      platformsTitle: "Or Book Directly",
      airbnb: "Book on Airbnb",
      bookingcom: "Book on Booking.com",
      directStrip: {
        title: "Book direct — save on fees, reply fastest",
        noFees: "No platform commission",
        fastReplies: "Replies within hours from the owner",
        flexibility: "Flexible on dates & long stays"
      }
    },

    // Footer
    footer: {
      about: "A unique vacation rental in Paros, Greece — where disco history meets island serenity.",
      quickLinks: "Quick Links",
      contactTitle: "Contact",
      phone: "+30 XXX XXX XXXX",
      email: "info@seatree.gr",
      address: "Aliki Beach, Paros 844 00, Greece",
      copyright: "© 2026 Sea Tree. All rights reserved."
    }
  },

  es: {
    // Meta
    meta: {
      title: "Sea Tree | Alquiler Vacacional en Paros, Grecia",
      description: "Sea Tree — un alquiler vacacional único en la playa de Aliki, Paros, Grecia. El legendario disco bar Romantica, transformado en un refugio sereno de la isla.",
      ogTitle: "Sea Tree | Alquiler Vacacional en Paros, Grecia",
      ogDescription: "De la pista de baile al sueño — Sea Tree, un alquiler vacacional único en Aliki, Paros. El legendario disco bar Romantica, ahora un refugio sereno.",
      twitterTitle: "Sea Tree | Paros, Grecia",
      twitterDescription: "De la pista de baile al sueño — Sea Tree, alquiler vacacional en Aliki, Paros."
    },

    // Accessibility
    a11y: {
      skipToMain: "Saltar al contenido principal"
    },

    // Mobile book bar
    mobileBar: {
      checkAvailability: "Ver Disponibilidad",
      whatsappAria: "Escríbenos por WhatsApp"
    },

    // Navigation
    nav: {
      story: "Nuestra Historia",
      gallery: "Galería",
      reviews: "Reseñas",
      amenities: "Servicios",
      location: "Ubicación",
      availability: "Disponibilidad",
      contact: "Contacto"
    },

    // Hero
    hero: {
      title: "Sea Tree",
      tagline: "Desacelera. Respira. Sé.",
      location: "Playa de Aliki, Paros, Grecia",
      checkAvailability: "Ver Disponibilidad",
      ourStory: "Nuestra Historia"
    },

    // Story Section
    story: {
      label: "Nuestra Historia",
      title: "Donde el Ritmo Se Convirtió en Mañanas Tranquilas",
      p1: "Esta casa azul fue una vez la discoteca Romantica — el corazón de la vida nocturna de Paros donde isleños y viajeros bailaban hasta el amanecer.",
      p2: "Hoy, esas mismas paredes tienen un ritmo diferente. Luz matutina a través de cortinas blancas. Café en el balcón. Suelos de piedra frescos bajo los pies. El alma de Romantica sigue viva — en el sonido de las olas, el aire salado y el ritmo lento de la vida isleña.",
      highlight: {
        title: "Un Toque de Historia",
        text: "Pregunta a los locales sobre Romantica — sonreirán y compartirán historias de las mejores fiestas de la isla. Ahora es tu turno de crear recuerdos más tranquilos."
      }
    },

    // Gallery
    gallery: {
      label: "Galería",
      title: "El Espacio",
      subtitle: "Luz natural. Suelos de piedra. Sábanas de algodón. Espacio para respirar."
    },

    // Reviews
    reviews: {
      label: "Reseñas de Huéspedes",
      title: "Lo que dicen los huéspedes",
      subtitle: "Visitantes reales, estancias reales — extraídas de nuestras páginas en Airbnb, Google y Booking.com.",
      moreAirbnb: "Ver más en Airbnb →"
    },

    // Amenities
    amenities: {
      label: "Servicios",
      title: "Lo Que Ofrecemos",
      subtitle: "Esenciales simples y de calidad para tu estancia",
      items: {
        wifi: { title: "Internet Starlink", desc: "Conexión fiable de alta velocidad" },
        ac: { title: "Aire Acondicionado", desc: "En cada habitación" },
        kitchen: { title: "Cocina Completa", desc: "Cocina con ingredientes locales" },
        parking: { title: "Parking Público Gratuito", desc: "Aparcamiento en la calle disponible" },
        terrace: { title: "Gran Balcón", desc: "Vistas sureste, luz matutina" },
        washer: { title: "Lavadora", desc: "Para estancias largas" },
        linens: { title: "Sábanas 100% Algodón", desc: "Toallas y ropa de cama limpias" },
        beach: { title: "Toallas de Playa", desc: "Incluidas para tus días de playa" }
      }
    },

    // The Space (selling points)
    theSpace: {
      label: "El Espacio",
      title: "Espacio para Respirar",
      subtitle: "Un lugar diseñado para descansar y mañanas lentas",
      items: {
        bathrooms: { title: "2 Baños", desc: "Uno en suite, uno compartido" },
        yoga: { title: "Sala de Yoga", desc: "Espacio dedicado para práctica" },
        balcony: { title: "Gran Balcón", desc: "Orientación sureste, sol matutino" }
      }
    },

    // Bedrooms
    bedrooms: {
      label: "Dormitorios",
      title: "Espacios de Descanso",
      subtitle: "Espacios cómodos para dulces sueños isleños",
      room1: {
        title: "Dormitorio Principal",
        desc: "Cama king-size, vistas al mar, baño privado"
      },
      room2: {
        title: "Dormitorio de Invitados",
        desc: "Dos camas individuales, perfecto para amigos o niños"
      }
    },

    // Beach Access
    beach: {
      label: "Bueno Saber",
      title: "Sobre Nuestra Playa",
      warningTitle: "⚠️ Nota Honesta",
      warning: "El acceso a nuestra playa incluye un camino rocoso y costa natural de piedra. Es absolutamente impresionante y prístino — pero queremos que sepas:",
      points: [
        "El camino tiene terreno irregular (no apto para sillas de ruedas)",
        "Mejor traer zapatos de agua para comodidad",
        "Las maletas grandes pueden ser difíciles al llegar"
      ],
      altTitle: "🏖️ ¿Prefieres Playas de Arena?",
      altIntro: "¡Sin problema! Hermosas playas de arena cerca:",
      alt1: "Playa de Arena de Aliki — 1 minuto a pie",
      alt2: "Playa Piso Aliki — 5 minutos a pie",
      alt3: "Agios Nikolaos — 10 minutos en coche"
    },

    // Location
    location: {
      label: "Ubicación",
      title: "En el Corazón de Aliki",
      subtitle: "Un pueblo tranquilo en el sur de Paros",
      distances: {
        port: { label: "Puerto de Parikia", value: "12 km (15 min)" },
        airport: { label: "Aeropuerto de Paros", value: "2 km (5 min)" },
        village: { label: "Pueblo de Aliki", value: "2 min a pie" },
        market: { label: "Supermercado", value: "5 min a pie" },
        naousa: { label: "Naousa (vida nocturna)", value: "22 km (25 min)" }
      }
    },

    // Neighborhood
    neighborhood: {
      label: "Comer y Explorar",
      title: "Tu Vecindario en Aliki",
      subtitle: "Cuatro tabernas familiares a poca distancia. Pescado fresco. Cocina honesta.",
      nightlife: "¿Prefieres vida nocturna? Naousa está a 25 minutos en coche — el pueblo más animado de la isla.",
      tavernas: {
        mouragio: { name: "To Mouragio", desc: "Frente al mar, mariscos frescos, familiar por 30 años", distance: "2 min a pie" },
        aliki: { name: "Aliki Restaurant", desc: "Clásicos griegos, recetas familiares desde 1974", distance: "3 min a pie" },
        thalassamou: { name: "Thalassamou", desc: "Mesas frente a la playa, pescado a la parrilla", distance: "4 min a pie" },
        balcony: { name: "To Balcony tou Aki", desc: "Pescado del día, simple y fresco", distance: "5 min a pie" }
      }
    },

    // Calendar/Availability
    calendar: {
      label: "Disponibilidad",
      title: "Planifica Tu Estancia",
      subtitle: "Consulta nuestra disponibilidad y reserva tus fechas perfectas",
      available: "Disponible",
      booked: "Reservado",
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    },

    // FAQ
    faq: {
      label: "Preguntas Frecuentes",
      title: "Preguntas, respondidas",
      subtitle: "Lo que preguntan los huéspedes antes de reservar — en un solo lugar.",
      q1: {
        q: "¿Cómo llego desde el puerto de Paros a Aliki?",
        a: "En coche, 15 minutos. En autobús, 25–35 minutos en la línea KTEL Paros con parada en Aliki. Hay taxis disponibles en el puerto. Si vuelas, el aeropuerto de Paros está a 5 minutos de Sea Tree."
      },
      q2: {
        q: "¿Sea Tree es apto para familias?",
        a: "Sí. Dos dormitorios para hasta cuatro personas; la terraza está totalmente cercada del mar para que los niños jueguen con tranquilidad. Trae zapatos de agua — la costa inmediata es rocosa; la playa de arena de Aliki está a 1 minuto a pie."
      },
      q3: {
        q: "¿Cómo es el proceso de check-in?",
        a: "Auto check-in desde las 15:00. Yorgos o su asistente te recibirán en persona si lo deseas; de lo contrario, recibirás los detalles de la llave por mensaje la mañana de tu llegada."
      },
      q4: {
        q: "¿Puedo dejar el equipaje antes de las 15:00 o después de las 11:00?",
        a: "Sí — puedes dejarlo desde el mediodía el día de llegada, y dejarlo hasta tu ferry el día de salida. Sin coste extra."
      },
      q5: {
        q: "¿Hay aparcamiento?",
        a: "Aparcamiento público gratuito en la calle. Aliki tiene sitios de sobra, excepto las dos primeras semanas de agosto."
      },
      q6: {
        q: "¿La playa es de arena?",
        a: "La costa frente a Sea Tree es de piedra natural — espectacular al atardecer, poco cómoda descalzo. Para arena: la playa principal de Aliki está a 1 minuto, Piso Aliki a 5, Agios Nikolaos a 10 minutos en coche."
      },
      q7: {
        q: "¿Política de mascotas?",
        a: "Lo sentimos — no se admiten mascotas. Es una decisión de limpieza y alergias para futuros huéspedes."
      },
      q8: {
        q: "¿A qué distancia está la vida nocturna?",
        a: "Naoussa, el centro nocturno de la isla, está a 22 km / 25 minutos en coche. Parikia a 12 km / 15 minutos. Aliki es deliberadamente tranquilo — tavernas abiertas hasta tarde, pero sin discotecas."
      },
      q9: {
        q: "¿Cuál es la velocidad del WiFi?",
        a: "Starlink: típicamente 150–250 Mbps de bajada, 15–30 Mbps de subida, latencia inferior a 60 ms. Suficiente para videollamadas y teletrabajo."
      },
      q10: {
        q: "¿Hay carga de coche eléctrico cerca?",
        a: "El cargador rápido más cercano está en Parikia, a 12 km / 15 minutos. Hay algunos cargadores AC Nivel 2 en hoteles de Naoussa. Todavía no hay cargador público en Aliki."
      },
      q11: {
        q: "¿Farmacia y atención médica?",
        a: "Farmacia pequeña en Aliki, a 3 minutos a pie. Farmacias más grandes y centro médico en Parikia. El Centro de Salud de Paros (urgencias 24/7) está a 15 minutos en coche."
      },
      q12: {
        q: "¿El supermercado acepta tarjeta?",
        a: "Sí — tanto el supermercado de Aliki como los más grandes de Parikia aceptan tarjetas. Lleva algo de efectivo para tavernas pequeñas y algún kiosco."
      }
    },

    // Booking/Contact
    booking: {
      label: "Reserva Tu Estancia",
      title: "¿Listo Para Vivir Sea Tree?",
      subtitle: "Contáctanos o reserva directamente en tu plataforma favorita",
      formTitle: "Envíanos un Mensaje",
      name: "Tu Nombre",
      email: "Correo Electrónico",
      dates: "Fechas Preferidas",
      guests: "Número de Huéspedes",
      message: "Tu Mensaje",
      newsletter: "Envíame consejos ocasionales sobre Paros y disponibilidad",
      send: "Enviar Consulta",
      platformsTitle: "O Reserva Directamente",
      airbnb: "Reservar en Airbnb",
      bookingcom: "Reservar en Booking.com",
      directStrip: {
        title: "Reserva directa — menor precio, respuesta más rápida",
        noFees: "Sin comisión de plataforma",
        fastReplies: "Respuestas en horas, directamente del propietario",
        flexibility: "Flexibilidad en fechas y estancias largas"
      }
    },

    // Footer
    footer: {
      about: "Un alquiler vacacional único en Paros, Grecia — donde la historia disco se encuentra con la serenidad isleña.",
      quickLinks: "Enlaces Rápidos",
      contactTitle: "Contacto",
      phone: "+30 XXX XXX XXXX",
      email: "info@seatree.gr",
      address: "Playa de Aliki, Paros 844 00, Grecia",
      copyright: "© 2026 Sea Tree. Todos los derechos reservados."
    }
  },

  el: {
    // Meta
    meta: {
      title: "Sea Tree | Εξοχική Κατοικία στην Πάρο, Ελλάδα",
      description: "Sea Tree — μια μοναδική εξοχική κατοικία στην Αλυκή, Πάρος, Ελλάδα. Το θρυλικό disco bar Romantica, μεταμορφωμένο σε γαλήνιο νησιωτικό καταφύγιο.",
      ogTitle: "Sea Tree | Εξοχική Κατοικία στην Πάρο, Ελλάδα",
      ogDescription: "Από την πίστα χορού στο όνειρο — Sea Tree, μοναδική εξοχική κατοικία στην Αλυκή, Πάρο. Το θρυλικό disco bar Romantica, τώρα γαλήνιο καταφύγιο.",
      twitterTitle: "Sea Tree | Πάρος, Ελλάδα",
      twitterDescription: "Από την πίστα χορού στο όνειρο — Sea Tree, εξοχική κατοικία στην Αλυκή, Πάρος."
    },

    // Accessibility
    a11y: {
      skipToMain: "Μετάβαση στο κύριο περιεχόμενο"
    },

    // Mobile book bar
    mobileBar: {
      checkAvailability: "Δείτε Διαθεσιμότητα",
      whatsappAria: "Γράψτε μας στο WhatsApp"
    },

    // Navigation
    nav: {
      story: "Η Ιστορία μας",
      gallery: "Γκαλερί",
      reviews: "Κριτικές",
      amenities: "Παροχές",
      location: "Τοποθεσία",
      availability: "Διαθεσιμότητα",
      contact: "Επικοινωνία"
    },

    // Hero
    hero: {
      title: "Sea Tree",
      tagline: "Χαλάρωσε. Ανάπνευσε. Να'σαι.",
      location: "Αλυκή, Πάρος, Ελλάδα",
      checkAvailability: "Έλεγχος Διαθεσιμότητας",
      ourStory: "Η Ιστορία μας"
    },

    // Story Section
    story: {
      label: "Η Ιστορία μας",
      title: "Όπου ο Ρυθμός Έγινε Ήσυχα Πρωινά",
      p1: "Αυτό το μπλε σπίτι ήταν κάποτε το disco bar Romantica — η καρδιά της νυχτερινής ζωής της Πάρου όπου ντόπιοι και ταξιδιώτες χόρευαν μέχρι την ανατολή.",
      p2: "Σήμερα, οι ίδιοι τοίχοι έχουν έναν διαφορετικό ρυθμό. Πρωινό φως μέσα από λευκές κουρτίνες. Καφές στο μπαλκόνι. Πέτρινα πατώματα δροσερά κάτω από τα πόδια. Η ψυχή της Romantica ζει ακόμα — στον ήχο των κυμάτων, τον αλμυρό αέρα και τον αργό ρυθμό της νησιώτικης ζωής.",
      highlight: {
        title: "Μια Πινελιά Ιστορίας",
        text: "Ρωτήστε τους ντόπιους για τη Romantica — θα χαμογελάσουν και θα μοιραστούν ιστορίες από τα καλύτερα πάρτι του νησιού. Τώρα είναι η σειρά σας να δημιουργήσετε πιο ήσυχες αναμνήσεις."
      }
    },

    // Gallery
    gallery: {
      label: "Γκαλερί",
      title: "Ο Χώρος",
      subtitle: "Φυσικό φως. Πέτρινα πατώματα. Βαμβακερά σεντόνια. Χώρος να αναπνεύσετε."
    },

    // Reviews
    reviews: {
      label: "Κριτικές Επισκεπτών",
      title: "Τι λένε οι επισκέπτες",
      subtitle: "Αληθινοί επισκέπτες, αληθινές διαμονές — από τις σελίδες μας σε Airbnb, Google και Booking.com.",
      moreAirbnb: "Δείτε περισσότερα στο Airbnb →"
    },

    // Amenities
    amenities: {
      label: "Παροχές",
      title: "Τι Προσφέρουμε",
      subtitle: "Απλά, ποιοτικά απαραίτητα για τη διαμονή σας",
      items: {
        wifi: { title: "Internet Starlink", desc: "Αξιόπιστη σύνδεση υψηλής ταχύτητας" },
        ac: { title: "Κλιματισμός", desc: "Σε κάθε δωμάτιο" },
        kitchen: { title: "Πλήρης Κουζίνα", desc: "Μαγειρέψτε με τοπικά υλικά" },
        parking: { title: "Δωρεάν Δημόσιο Πάρκινγκ", desc: "Στάθμευση στο δρόμο διαθέσιμη" },
        terrace: { title: "Μεγάλο Μπαλκόνι", desc: "Θέα νοτιοανατολικά, πρωινό φως" },
        washer: { title: "Πλυντήριο", desc: "Για μεγαλύτερες διαμονές" },
        linens: { title: "Σεντόνια 100% Βαμβάκι", desc: "Καθαρές πετσέτες & κλινοσκεπάσματα" },
        beach: { title: "Πετσέτες Θαλάσσης", desc: "Παρέχονται για τις μέρες στην παραλία" }
      }
    },

    // The Space (selling points)
    theSpace: {
      label: "Ο Χώρος",
      title: "Χώρος να Αναπνεύσετε",
      subtitle: "Ένας χώρος σχεδιασμένος για ξεκούραση και αργά πρωινά",
      items: {
        bathrooms: { title: "2 Μπάνια", desc: "Ένα en-suite, ένα κοινόχρηστο" },
        yoga: { title: "Δωμάτιο Yoga", desc: "Αφιερωμένος χώρος για άσκηση" },
        balcony: { title: "Μεγάλο Μπαλκόνι", desc: "Νοτιοανατολικός προσανατολισμός, πρωινός ήλιος" }
      }
    },

    // Bedrooms
    bedrooms: {
      label: "Υπνοδωμάτια",
      title: "Ξεκούραστοι Χώροι",
      subtitle: "Άνετοι χώροι για γλυκά νησιώτικα όνειρα",
      room1: {
        title: "Κύριο Υπνοδωμάτιο",
        desc: "Διπλό κρεβάτι, θέα θάλασσα, ιδιωτικό μπάνιο"
      },
      room2: {
        title: "Δεύτερο Υπνοδωμάτιο",
        desc: "Δύο μονά κρεβάτια, ιδανικό για φίλους ή παιδιά"
      }
    },

    // Beach Access
    beach: {
      label: "Καλό να Γνωρίζετε",
      title: "Σχετικά με την Παραλία μας",
      warningTitle: "⚠️ Ειλικρινής Σημείωση",
      warning: "Η πρόσβαση στην παραλία μας περιλαμβάνει βραχώδες μονοπάτι και φυσική πέτρινη ακτή. Είναι απόλυτα εντυπωσιακή και παρθένα — αλλά θέλουμε να γνωρίζετε:",
      points: [
        "Το μονοπάτι έχει ανώμαλο έδαφος (δεν είναι κατάλληλο για αναπηρικά αμαξίδια)",
        "Καλύτερα να φέρετε παπούτσια θαλάσσης για άνεση",
        "Οι μεγάλες βαλίτσες μπορεί να είναι δύσκολες κατά την άφιξη"
      ],
      altTitle: "🏖️ Προτιμάτε Αμμώδεις Παραλίες;",
      altIntro: "Κανένα πρόβλημα! Όμορφες αμμώδεις παραλίες κοντά:",
      alt1: "Αμμώδης Παραλία Αλυκής — 1 λεπτό με τα πόδια",
      alt2: "Παραλία Πίσω Αλυκή — 5 λεπτά με τα πόδια",
      alt3: "Άγιος Νικόλαος — 10 λεπτά με αυτοκίνητο"
    },

    // Location
    location: {
      label: "Τοποθεσία",
      title: "Στην Καρδιά της Αλυκής",
      subtitle: "Ένα ήσυχο χωριό στη νότια Πάρο",
      distances: {
        port: { label: "Λιμάνι Παροικιάς", value: "12 χλμ (15 λεπτά)" },
        airport: { label: "Αεροδρόμιο Πάρου", value: "2 χλμ (5 λεπτά)" },
        village: { label: "Χωριό Αλυκής", value: "2 λεπτά πεζή" },
        market: { label: "Σούπερ Μάρκετ", value: "5 λεπτά πεζή" },
        naousa: { label: "Νάουσα (νυχτερινή ζωή)", value: "22 χλμ (25 λεπτά)" }
      }
    },

    // Neighborhood
    neighborhood: {
      label: "Φαγητό & Εξερεύνηση",
      title: "Η Γειτονιά σας στην Αλυκή",
      subtitle: "Τέσσερις οικογενειακές ταβέρνες σε κοντινή απόσταση. Φρέσκο ψάρι. Ειλικρινής μαγειρική.",
      nightlife: "Προτιμάτε νυχτερινή ζωή; Η Νάουσα είναι 25 λεπτά με αυτοκίνητο — το πιο ζωντανό χωριό του νησιού.",
      tavernas: {
        mouragio: { name: "To Mouragio", desc: "Στην παραλία, φρέσκα θαλασσινά, οικογενειακή για 30 χρόνια", distance: "2 λεπτά πεζή" },
        aliki: { name: "Aliki Restaurant", desc: "Ελληνικά κλασικά, οικογενειακές συνταγές από το 1974", distance: "3 λεπτά πεζή" },
        thalassamou: { name: "Thalassamou", desc: "Τραπέζια στην παραλία, ψητό ψάρι", distance: "4 λεπτά πεζή" },
        balcony: { name: "To Balcony tou Aki", desc: "Ψάρι ντόπιου ψαρά, απλό και φρέσκο", distance: "5 λεπτά πεζή" }
      }
    },

    // Calendar/Availability
    calendar: {
      label: "Διαθεσιμότητα",
      title: "Σχεδιάστε τη Διαμονή σας",
      subtitle: "Ελέγξτε τη διαθεσιμότητά μας και κλείστε τις τέλειες ημερομηνίες",
      available: "Διαθέσιμο",
      booked: "Κρατημένο",
      months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
        "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
      days: ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"]
    },

    // FAQ
    faq: {
      label: "Συχνές Ερωτήσεις",
      title: "Οι απαντήσεις, με μια ματιά",
      subtitle: "Ό,τι ρωτούν οι επισκέπτες πριν κλείσουν — σε ένα σημείο.",
      q1: {
        q: "Πώς φτάνω από το λιμάνι της Πάρου στην Αλυκή;",
        a: "Με αυτοκίνητο, 15 λεπτά. Με λεωφορείο, 25–35 λεπτά με τη γραμμή ΚΤΕΛ Πάρου, στάση στην Αλυκή. Στο λιμάνι υπάρχουν ταξί. Αν έρχεστε αεροπορικώς, το αεροδρόμιο της Πάρου είναι 5 λεπτά από το Sea Tree."
      },
      q2: {
        q: "Το Sea Tree είναι κατάλληλο για οικογένειες;",
        a: "Ναι. Δύο υπνοδωμάτια για έως τέσσερα άτομα· η βεράντα είναι φραγμένη από τη θάλασσα ώστε τα παιδιά να παίζουν ήρεμα. Φέρτε παπούτσια θαλάσσης — η ακτή μπροστά είναι βραχώδης· η αμμώδης παραλία της Αλυκής απέχει 1 λεπτό με τα πόδια."
      },
      q3: {
        q: "Πώς γίνεται το check-in;",
        a: "Self check-in από τις 15:00. Ο Γιώργος ή ο βοηθός του μπορεί να σας καλωσορίσει προσωπικά αν το ζητήσετε· διαφορετικά, θα λάβετε οδηγίες το πρωί της άφιξης."
      },
      q4: {
        q: "Μπορώ να αφήσω τις αποσκευές πριν τις 15:00 ή μετά τις 11:00;",
        a: "Ναι — μπορείτε να τις αφήσετε από το μεσημέρι της άφιξης και μέχρι το πλοίο σας την ημέρα της αναχώρησης. Χωρίς επιπλέον χρέωση."
      },
      q5: {
        q: "Υπάρχει πάρκινγκ;",
        a: "Δωρεάν δημόσιο πάρκινγκ στον δρόμο. Η Αλυκή έχει αρκετές θέσεις, εκτός από τις δύο πρώτες εβδομάδες του Αυγούστου."
      },
      q6: {
        q: "Η παραλία είναι αμμώδης;",
        a: "Η ακτή ακριβώς μπροστά από το Sea Tree είναι φυσική πέτρα — εντυπωσιακή στο ηλιοβασίλεμα, δύσκολη ξυπόλυτα. Για άμμο: η κυρίως παραλία της Αλυκής είναι 1 λεπτό, η Πίσω Αλυκή 5 λεπτά, ο Άγιος Νικόλαος 10 λεπτά με αυτοκίνητο."
      },
      q7: {
        q: "Επιτρέπονται τα κατοικίδια;",
        a: "Δυστυχώς όχι. Είναι απόφαση για καθαριότητα και αλλεργίες των επόμενων επισκεπτών."
      },
      q8: {
        q: "Πόσο μακριά είναι η νυχτερινή διασκέδαση;",
        a: "Η Νάουσα, το κέντρο της νυχτερινής ζωής, απέχει 22 χλμ / 25 λεπτά με αυτοκίνητο. Η Παροικιά 12 χλμ / 15 λεπτά. Η Αλυκή είναι σκόπιμα ήσυχη — οι ταβέρνες μένουν μέχρι αργά, αλλά χωρίς κλαμπ."
      },
      q9: {
        q: "Πόση είναι η ταχύτητα του WiFi;",
        a: "Starlink: συνήθως 150–250 Mbps κατέβασμα, 15–30 Mbps ανέβασμα, latency κάτω από 60 ms. Αρκετό για video κλήσεις και απομακρυσμένη εργασία."
      },
      q10: {
        q: "Υπάρχει φόρτιση ηλεκτρικών αυτοκινήτων κοντά;",
        a: "Ο πλησιέστερος ταχυφορτιστής είναι στην Παροικιά, 12 χλμ / 15 λεπτά. Υπάρχουν λίγοι AC φορτιστές Επιπέδου 2 σε ξενοδοχεία της Νάουσας. Δεν υπάρχει ακόμη δημόσιος φορτιστής στην Αλυκή."
      },
      q11: {
        q: "Φαρμακείο και ιατρική βοήθεια;",
        a: "Μικρό φαρμακείο στην Αλυκή, 3 λεπτά με τα πόδια. Μεγαλύτερα φαρμακεία και ιατρικό κέντρο στην Παροικιά. Το Κέντρο Υγείας Πάρου (εφημερεία 24/7) απέχει 15 λεπτά με αυτοκίνητο."
      },
      q12: {
        q: "Το σούπερ μάρκετ δέχεται κάρτα;",
        a: "Ναι — και το σούπερ μάρκετ στην Αλυκή και τα μεγαλύτερα στην Παροικιά δέχονται κάρτες. Κρατήστε λίγα μετρητά για μικρότερες ταβέρνες και περίπτερα."
      }
    },

    // Booking/Contact
    booking: {
      label: "Κλείστε τη Διαμονή σας",
      title: "Έτοιμοι να Ζήσετε το Sea Tree;",
      subtitle: "Επικοινωνήστε μαζί μας ή κλείστε απευθείας στην αγαπημένη σας πλατφόρμα",
      formTitle: "Στείλτε μας Μήνυμα",
      name: "Το Όνομά σας",
      email: "Διεύθυνση Email",
      dates: "Προτιμώμενες Ημερομηνίες",
      guests: "Αριθμός Επισκεπτών",
      message: "Το Μήνυμά σας",
      newsletter: "Στείλτε μου περιστασιακές συμβουλές για την Πάρο & διαθεσιμότητα",
      send: "Αποστολή Ερώτησης",
      platformsTitle: "Ή Κλείστε Απευθείας",
      airbnb: "Κράτηση στο Airbnb",
      bookingcom: "Κράτηση στο Booking.com",
      directStrip: {
        title: "Κλείστε απευθείας — χωρίς προμήθειες, ταχύτερη απάντηση",
        noFees: "Χωρίς προμήθεια πλατφόρμας",
        fastReplies: "Απαντήσεις εντός ωρών, απευθείας από τον ιδιοκτήτη",
        flexibility: "Ευελιξία σε ημερομηνίες & μεγαλύτερες διαμονές"
      }
    },

    // Footer
    footer: {
      about: "Μοναδικό ενοικιαζόμενο κατάλυμα στην Πάρο, Ελλάδα — όπου η disco ιστορία συναντά τη νησιώτικη γαλήνη.",
      quickLinks: "Γρήγοροι Σύνδεσμοι",
      contactTitle: "Επικοινωνία",
      phone: "+30 XXX XXX XXXX",
      email: "info@seatree.gr",
      address: "Αλυκή, Πάρος 844 00, Ελλάδα",
      copyright: "© 2026 Sea Tree. Με επιφύλαξη παντός δικαιώματος."
    }
  },

  fr: {
    // Meta
    meta: {
      title: "Sea Tree | Location de Vacances à Paros, Grèce",
      description: "Sea Tree — une location de vacances unique à la plage d'Aliki, Paros, Grèce. Le légendaire disco-bar Romantica, transformé en refuge insulaire serein.",
      ogTitle: "Sea Tree | Location de Vacances à Paros, Grèce",
      ogDescription: "De la piste de danse au rêve — Sea Tree, location de vacances unique à Aliki, Paros. Le légendaire disco-bar Romantica, devenu refuge paisible.",
      twitterTitle: "Sea Tree | Paros, Grèce",
      twitterDescription: "De la piste de danse au rêve — Sea Tree, location de vacances à Aliki, Paros."
    },

    // Accessibility
    a11y: {
      skipToMain: "Passer au contenu principal"
    },

    // Mobile book bar
    mobileBar: {
      checkAvailability: "Voir la Disponibilité",
      whatsappAria: "Écrivez-nous sur WhatsApp"
    },

    // Navigation
    nav: {
      story: "Notre Histoire",
      gallery: "Galerie",
      reviews: "Avis",
      amenities: "Équipements",
      location: "Emplacement",
      availability: "Disponibilité",
      contact: "Contact"
    },

    // Hero
    hero: {
      title: "Sea Tree",
      tagline: "Ralentissez. Respirez. Soyez.",
      location: "Plage d'Aliki, Paros, Grèce",
      checkAvailability: "Vérifier Disponibilité",
      ourStory: "Notre Histoire"
    },

    // Story Section
    story: {
      label: "Notre Histoire",
      title: "Où les Rythmes Sont Devenus Matins Paisibles",
      p1: "Cette maison bleue était autrefois le disco-bar Romantica — le cœur de la vie nocturne de Paros où les insulaires et les voyageurs dansaient jusqu'au lever du soleil.",
      p2: "Aujourd'hui, ces mêmes murs ont un rythme différent. Lumière du matin à travers les rideaux blancs. Café sur le balcon. Sols en pierre fraîche sous les pieds. L'âme de Romantica vit toujours — dans le bruit des vagues, l'air salé et le rythme lent de la vie insulaire.",
      highlight: {
        title: "Une Touche d'Histoire",
        text: "Demandez aux locaux à propos de Romantica — ils souriront et partageront des histoires des meilleures fêtes de l'île. C'est maintenant à votre tour de créer des souvenirs plus paisibles."
      }
    },

    // Gallery
    gallery: {
      label: "Galerie",
      title: "L'Espace",
      subtitle: "Lumière naturelle. Sols en pierre. Draps en coton. Espace pour respirer."
    },

    // Reviews
    reviews: {
      label: "Avis de Voyageurs",
      title: "Ce que disent nos hôtes",
      subtitle: "Vrais voyageurs, vrais séjours — tirés de nos pages Airbnb, Google et Booking.com.",
      moreAirbnb: "Voir plus sur Airbnb →"
    },

    // Amenities
    amenities: {
      label: "Équipements",
      title: "Ce Que Nous Offrons",
      subtitle: "Essentiels simples et de qualité pour votre séjour",
      items: {
        wifi: { title: "Internet Starlink", desc: "Connexion fiable haut débit" },
        ac: { title: "Climatisation", desc: "Dans chaque pièce" },
        kitchen: { title: "Cuisine Équipée", desc: "Cuisinez avec des ingrédients locaux" },
        parking: { title: "Parking Public Gratuit", desc: "Stationnement dans la rue disponible" },
        terrace: { title: "Grand Balcon", desc: "Vue sud-est, lumière du matin" },
        washer: { title: "Machine à Laver", desc: "Pour les longs séjours" },
        linens: { title: "Draps 100% Coton", desc: "Serviettes & literie propres" },
        beach: { title: "Serviettes de Plage", desc: "Fournies pour vos journées à la plage" }
      }
    },

    // The Space (selling points)
    theSpace: {
      label: "L'Espace",
      title: "Espace pour Respirer",
      subtitle: "Un lieu conçu pour le repos et les matins lents",
      items: {
        bathrooms: { title: "2 Salles de Bain", desc: "Une en suite, une partagée" },
        yoga: { title: "Salle de Yoga", desc: "Espace dédié pour la pratique" },
        balcony: { title: "Grand Balcon", desc: "Orientation sud-est, soleil du matin" }
      }
    },

    // Bedrooms
    bedrooms: {
      label: "Chambres",
      title: "Havres de Repos",
      subtitle: "Espaces confortables pour de doux rêves insulaires",
      room1: {
        title: "Chambre Principale",
        desc: "Lit king-size, vue mer, salle de bain privée"
      },
      room2: {
        title: "Chambre d'Amis",
        desc: "Deux lits simples, parfait pour amis ou enfants"
      }
    },

    // Beach Access
    beach: {
      label: "Bon à Savoir",
      title: "À Propos de Notre Plage",
      warningTitle: "⚠️ Note Honnête",
      warning: "L'accès à notre plage comprend un sentier rocheux et un littoral en pierre naturelle. C'est absolument magnifique et préservé — mais nous voulons que vous sachiez :",
      points: [
        "Le sentier a un terrain irrégulier (non adapté aux fauteuils roulants)",
        "Mieux vaut apporter des chaussures aquatiques pour le confort",
        "Les grandes valises peuvent être difficiles à l'arrivée"
      ],
      altTitle: "🏖️ Vous Préférez les Plages de Sable ?",
      altIntro: "Pas de souci ! Belles plages de sable à proximité :",
      alt1: "Plage de Sable d'Aliki — 1 minute à pied",
      alt2: "Plage Piso Aliki — 5 minutes à pied",
      alt3: "Agios Nikolaos — 10 minutes en voiture"
    },

    // Location
    location: {
      label: "Emplacement",
      title: "Au Cœur d'Aliki",
      subtitle: "Un village paisible dans le sud de Paros",
      distances: {
        port: { label: "Port de Parikia", value: "12 km (15 min)" },
        airport: { label: "Aéroport de Paros", value: "2 km (5 min)" },
        village: { label: "Village d'Aliki", value: "2 min à pied" },
        market: { label: "Supermarché", value: "5 min à pied" },
        naousa: { label: "Naousa (vie nocturne)", value: "22 km (25 min)" }
      }
    },

    // Neighborhood
    neighborhood: {
      label: "Manger & Explorer",
      title: "Votre Quartier à Aliki",
      subtitle: "Quatre tavernes familiales à distance de marche. Poisson frais. Cuisine honnête.",
      nightlife: "Vous préférez la vie nocturne? Naousa est à 25 minutes en voiture — le village le plus animé de l'île.",
      tavernas: {
        mouragio: { name: "To Mouragio", desc: "Front de mer, fruits de mer frais, familial depuis 30 ans", distance: "2 min à pied" },
        aliki: { name: "Aliki Restaurant", desc: "Classiques grecs, recettes familiales depuis 1974", distance: "3 min à pied" },
        thalassamou: { name: "Thalassamou", desc: "Tables en bord de plage, poisson grillé", distance: "4 min à pied" },
        balcony: { name: "To Balcony tou Aki", desc: "Poisson du pêcheur local, simple et frais", distance: "5 min à pied" }
      }
    },

    // Calendar/Availability
    calendar: {
      label: "Disponibilité",
      title: "Planifiez Votre Séjour",
      subtitle: "Vérifiez notre disponibilité et réservez vos dates parfaites",
      available: "Disponible",
      booked: "Réservé",
      months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    },

    // FAQ
    faq: {
      label: "Questions Fréquentes",
      title: "Les réponses, d'un coup d'œil",
      subtitle: "Ce que les voyageurs demandent avant de réserver — au même endroit.",
      q1: {
        q: "Comment rejoindre Aliki depuis le port de Paros ?",
        a: "En voiture, 15 minutes. En bus, 25–35 minutes sur la ligne KTEL Paros avec arrêt à Aliki. Des taxis sont disponibles au port. En avion, l'aéroport de Paros est à 5 minutes de Sea Tree."
      },
      q2: {
        q: "Sea Tree est-il adapté aux familles ?",
        a: "Oui. Deux chambres pour quatre personnes ; la terrasse est entièrement clôturée côté mer pour que les enfants jouent sereinement. Prévoyez des chaussures d'eau — la côte immédiate est rocheuse ; la plage de sable d'Aliki est à 1 minute à pied."
      },
      q3: {
        q: "Comment se passe l'arrivée ?",
        a: "Auto check-in dès 15:00. Yorgos ou son assistant vous accueillera en personne sur demande ; sinon, vous recevrez les infos de clé par message le matin de l'arrivée."
      },
      q4: {
        q: "Puis-je déposer mes bagages avant 15:00 ou après 11:00 ?",
        a: "Oui — vous pouvez les déposer dès midi le jour de l'arrivée, et les laisser jusqu'à votre ferry le jour du départ. Sans frais supplémentaires."
      },
      q5: {
        q: "Y a-t-il un parking ?",
        a: "Stationnement public gratuit dans la rue. Aliki a largement assez de places, sauf les deux premières semaines d'août."
      },
      q6: {
        q: "La plage est-elle de sable ?",
        a: "La côte juste devant Sea Tree est en pierre naturelle — superbe au coucher du soleil, peu confortable pieds nus. Pour du sable : la plage principale d'Aliki est à 1 minute, Piso Aliki à 5, Agios Nikolaos à 10 minutes en voiture."
      },
      q7: {
        q: "Animaux acceptés ?",
        a: "Désolé — pas d'animaux. C'est un choix lié à l'entretien et aux allergies des prochains voyageurs."
      },
      q8: {
        q: "La vie nocturne, c'est où ?",
        a: "Naoussa, le cœur nocturne de l'île, est à 22 km / 25 minutes en voiture. Parikia à 12 km / 15 minutes. Aliki est volontairement calme — les tavernes ferment tard, mais pas de clubs."
      },
      q9: {
        q: "Quelle est la vitesse du WiFi ?",
        a: "Starlink : généralement 150–250 Mbps en téléchargement, 15–30 Mbps en envoi, latence sous 60 ms. Suffisant pour les visios et le télétravail."
      },
      q10: {
        q: "Y a-t-il des bornes de recharge voiture électrique ?",
        a: "La borne rapide la plus proche est à Parikia, 12 km / 15 minutes. Quelques bornes AC Niveau 2 dans les hôtels de Naoussa. Pas encore de borne publique à Aliki."
      },
      q11: {
        q: "Pharmacie et soins médicaux ?",
        a: "Petite pharmacie à Aliki, 3 minutes à pied. Des pharmacies plus grandes et un centre médical à Parikia. Le Centre de santé de Paros (urgences 24/7) est à 15 minutes en voiture."
      },
      q12: {
        q: "Le supermarché accepte-t-il la carte ?",
        a: "Oui — aussi bien le marché d'Aliki que les plus grands de Parikia acceptent les cartes. Gardez un peu de liquide pour les petites tavernes et les kiosques."
      }
    },

    // Booking/Contact
    booking: {
      label: "Réservez Votre Séjour",
      title: "Prêt à Vivre l'Expérience Sea Tree ?",
      subtitle: "Contactez-nous ou réservez directement sur votre plateforme préférée",
      formTitle: "Envoyez-nous un Message",
      name: "Votre Nom",
      email: "Adresse Email",
      dates: "Dates Préférées",
      guests: "Nombre d'Invités",
      message: "Votre Message",
      newsletter: "Envoyez-moi des conseils occasionnels sur Paros et la disponibilité",
      send: "Envoyer la Demande",
      platformsTitle: "Ou Réservez Directement",
      airbnb: "Réserver sur Airbnb",
      bookingcom: "Réserver sur Booking.com",
      directStrip: {
        title: "Réservez en direct — moins cher, réponse plus rapide",
        noFees: "Pas de commission de plateforme",
        fastReplies: "Réponses en quelques heures, directement du propriétaire",
        flexibility: "Flexibilité sur les dates & longs séjours"
      }
    },

    // Footer
    footer: {
      about: "Une location de vacances unique à Paros, Grèce — où l'histoire disco rencontre la sérénité insulaire.",
      quickLinks: "Liens Rapides",
      contactTitle: "Contact",
      phone: "+30 XXX XXX XXXX",
      email: "info@seatree.gr",
      address: "Plage d'Aliki, Paros 844 00, Grèce",
      copyright: "© 2026 Sea Tree. Tous droits réservés."
    }
  }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}
