module IconHelper
  def icon(name, size: 20, class_name: nil)
    shapes = case name.to_s
             when "clock"
               [
                 tag.circle(cx: 12, cy: 12, r: 9),
                 tag.path(d: "M12 7v5l3 3")
               ]
             when "map_pin"
               [
                 tag.path(d: "M20 10c0 4-8 12-8 12s-8-8-8-12a8 8 0 1 1 16 0z"),
                 tag.circle(cx: 12, cy: 10, r: 3)
               ]
             when "calendar"
               [
                 tag.rect(x: 3, y: 4, width: 18, height: 18, rx: 2),
                 tag.line(x1: 16, y1: 2, x2: 16, y2: 6),
                 tag.line(x1: 8, y1: 2, x2: 8, y2: 6),
                 tag.line(x1: 3, y1: 10, x2: 21, y2: 10)
               ]
             when "pencil"
               [
                 tag.path(d: "M12 20h9"),
                 tag.path(d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z")
               ]
             when "trash"
               [
                 tag.path(d: "M3 6h18"),
                 tag.path(d: "M8 6V4h8v2"),
                 tag.path(d: "M19 6l-1 14H6L5 6")
               ]
             when "x"
               [
                 tag.path(d: "M18 6L6 18"),
                 tag.path(d: "M6 6l12 12")
               ]
             when "plus"
               [
                 tag.path(d: "M12 5v14"),
                 tag.path(d: "M5 12h14")
               ]
             when "package"
               [
                 tag.path(d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"),
                 tag.path(d: "M3.3 7.6L12 12l8.7-4.4"),
                 tag.line(x1: 12, y1: 22, x2: 12, y2: 12)
               ]
             when "note"
               [
                 tag.path(d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"),
                 tag.path(d: "M14 2v6h6"),
                 tag.line(x1: 16, y1: 13, x2: 8, y2: 13),
                 tag.line(x1: 16, y1: 17, x2: 8, y2: 17)
               ]
             else
               []
             end

    return "" if shapes.empty?

    classes = ["icon", class_name].compact.join(" ")
    classes = nil if classes.empty?

    tag.svg(
      safe_join(shapes),
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: classes,
      "aria-hidden": "true",
      focusable: "false"
    )
  end
end
